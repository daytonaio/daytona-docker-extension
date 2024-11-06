FROM --platform=$BUILDPLATFORM node:18.16.0-alpine3.18 AS client-builder
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

FROM alpine:3.20

ARG DAYTONA_VERSION
ARG DAYTONA_DOWNLOAD_URL="https://download.daytona.io/daytona"
RUN apk update && apk add --no-cache curl openssh-client bash && \
    echo "daytona:x:1000:1000:Daytona:/home/daytona:/bin/bash" >> /etc/passwd && \
    echo "daytona:x:1000:" >> /etc/group && \
    mkdir -p /home/daytona && chown 1000:1000 /home/daytona


ARG BASE_URL=${DAYTONA_DOWNLOAD_URL}

COPY install.sh /install.sh
RUN chmod +x /install.sh && BASE_URL=${BASE_URL} DAYTONA_VERSION=${DAYTONA_VERSION} /install.sh && rm /install.sh

LABEL org.opencontainers.image.title="Daytona client tool"
LABEL org.opencontainers.image.description="Docker Extension for using an embedded version of Daytona client/server tools."
LABEL org.opencontainers.image.vendor="Daytona"
LABEL com.docker.desktop.extension.api.version=">= 0.2.3"
LABEL com.docker.extension.categories="utility-tools"
LABEL com.docker.extension.screenshots="[{\"alt\":\"Sample usage using scott user\", \"url\":\"https://raw.githubusercontent.com/daytonaio/daytona-docker-extension/main/docs/images/screenshot2.png\"},\
    {\"alt\":\"Some formating options\", \"url\":\"https://raw.githubusercontent.com/daytonaio/daytona-docker-extension/main/docs/images/screenshot3.png\"},\
    {\"alt\":\"Explain Plan\", \"url\":\"https://raw.githubusercontent.com/daytonaio/daytona-docker-extension/main/docs/images/screenshot4.png\"}]"
LABEL com.docker.extension.publisher-url="https://github.com/daytonaio/daytona-docker-extension"
LABEL com.docker.extension.additional-urls="[{\"title\":\"Documentation\",\"url\":\"https://docs.daytona.io\"},\
    {\"title\":\"License\",\"url\":\"https://github.com/daytonaio/daytona-docker-extension/blob/main/LICENSE\"}]"
LABEL com.docker.extension.detailed-description="Docker Extension for using Daytona client tool"
# LABEL com.docker.extension.changelog="See full <a href=\"https://github.com/daytonaio/daytona-docker-extension/blob/main/CHANGELOG.md\">change log</a>"
LABEL com.docker.desktop.extension.icon="https://www.daytona.io/favicon.ico"
LABEL com.docker.extension.detailed-description="Daytona is a self-hosted and secure open source development environment manager."
COPY daytona.svg metadata.json /

COPY --from=client-builder /app/client/dist /client

ENTRYPOINT ["sleep", "infinity"]