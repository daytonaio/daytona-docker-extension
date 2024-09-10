FROM --platform=$BUILDPLATFORM node:17.7-alpine3.14 AS client-builder
WORKDIR /app/client

# cache packages in layer
COPY client/package.json /app/client/package.json
COPY client/package-lock.json /app/client/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY client /app/client
RUN npm run build

FROM golang:1.17-alpine AS builder
ENV CGO_ENABLED=0
WORKDIR /backend
COPY vm/go.* .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go mod download
COPY vm/. .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go build -trimpath -ldflags="-s -w" -o bin/service

FROM alpine:3.20
ARG DAYTONA_SERVER_VERSION
RUN apk update && apk add --no-cache curl openssh-client ncurses bash ttyd tini sudo bash-completion && \
    (curl -sf -L https://download.daytona.io/daytona/install.sh | bash) && \
    echo "daytona:x:1000:1000:Daytona:/home/daytona:/bin/bash" >> /etc/passwd && \
    echo "daytona:x:1000:" >> /etc/group && \
    mkdir -p /home/daytona && chown 1000:1000 /home/daytona

LABEL org.opencontainers.image.title="Daytona client tool"
LABEL org.opencontainers.image.description="Docker Extension for using an embedded version of Daytona client/server tools."
LABEL org.opencontainers.image.vendor="Daytona"
LABEL com.docker.desktop.extension.api.version=">= 0.2.3"
LABEL com.docker.extension.categories="database,utility-tools"
LABEL com.docker.extension.screenshots="[{\"alt\":\"Sample usage using scott user\", \"url\":\"https://raw.githubusercontent.com/marcelo-ochoa/daytona-docker-extension/main/docs/images/screenshot2.png\"},\
    {\"alt\":\"Some formating options\", \"url\":\"https://raw.githubusercontent.com/marcelo-ochoa/daytona-docker-extension/main/docs/images/screenshot3.png\"},\
    {\"alt\":\"Explain Plan\", \"url\":\"https://raw.githubusercontent.com/marcelo-ochoa/daytona-docker-extension/main/docs/images/screenshot4.png\"}]"
LABEL com.docker.extension.publisher-url="https://github.com/marcelo-ochoa/daytona-docker-extension"
LABEL com.docker.extension.additional-urls="[{\"title\":\"Documentation\",\"url\":\"https://github.com/marcelo-ochoa/daytona-docker-extension/blob/main/README.md\"},\
    {\"title\":\"License\",\"url\":\"https://github.com/marcelo-ochoa/daytona-docker-extension/blob/main/LICENSE\"}]"
LABEL com.docker.extension.detailed-description="Docker Extension for using Daytona client tool"
LABEL com.docker.extension.changelog="See full <a href=\"https://github.com/marcelo-ochoa/daytona-docker-extension/blob/main/CHANGELOG.md\">change log</a>"
LABEL com.docker.desktop.extension.icon="https://raw.githubusercontent.com/marcelo-ochoa/daytona-docker-extension/main/client/public/favicon.ico"
LABEL com.docker.extension.detailed-description="Daytona is a self-hosted and secure open source development environment manager."
COPY daytona.svg metadata.json docker-compose.yml /

COPY --from=client-builder /app/client/dist /ui
COPY --from=builder /backend/bin/service /
COPY --chown=1000:1000 startup.sh daytona.sh /sbin/

ENTRYPOINT ["/sbin/tini", "--", "/service", "-socket", "/run/guest-services/daytona-docker-extension.sock"]