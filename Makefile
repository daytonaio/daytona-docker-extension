all: clean extension install

ORG=daytonaio
VERSION=0.25
MINOR=1
IMAGE_NAME=$(ORG)/daytona-docker-extension
DAYTONA_SERVER_VERSION=$(VERSION).${MINOR}
TAGGED_IMAGE_NAME=$(IMAGE_NAME):$(DAYTONA_SERVER_VERSION)

clean:
	-docker extension rm $(IMAGE_NAME)
	-docker rmi $(TAGGED_IMAGE_NAME)

extension:
	docker buildx build --load -t $(TAGGED_IMAGE_NAME) --build-arg DAYTONA_SERVER_VERSION="v$(DAYTONA_SERVER_VERSION)" --build-arg MINOR=$(MINOR) .

install: extension
	docker extension install -f $(TAGGED_IMAGE_NAME)

validate: extension
	docker extension validate $(TAGGED_IMAGE_NAME)

update: extension
	docker extension update -f $(TAGGED_IMAGE_NAME)

multiarch:
	docker buildx create --name=buildx-multi-arch --driver=docker-container --driver-opt=network=host

build:
	docker buildx build --push --builder=buildx-multi-arch --platform=linux/amd64,linux/arm64 --build-arg VERSION=$(VERSION) --tag=$(TAGGED_IMAGE_NAME) .
