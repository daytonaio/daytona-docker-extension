all: clean extension install

ORG=daytonaio
IMAGE_NAME=$(ORG)/docker-extension
TAGGED_IMAGE_NAME=$(IMAGE_NAME):$(DAYTONA_VERSION)

clean:
	-docker extension rm $(IMAGE_NAME)
	-docker rmi $(TAGGED_IMAGE_NAME)

extension:
	docker buildx build --load -t $(TAGGED_IMAGE_NAME) --build-arg DAYTONA_VERSION="$(DAYTONA_VERSION)" .

install: extension
	docker extension install -f $(TAGGED_IMAGE_NAME)

uninstall:
	docker extension uninstall $(TAGGED_IMAGE_NAME)
	
validate: extension
	docker extension validate $(TAGGED_IMAGE_NAME)

update: extension
	docker extension update -f $(TAGGED_IMAGE_NAME)

multiarch:
	docker buildx create --name=buildx-multi-arch --driver=docker-container --driver-opt=network=host

build:
	docker buildx build --push --builder=buildx-multi-arch --platform=linux/amd64,linux/arm64 --build-arg DAYTONA_VERSION=${DAYTONA_VERSION} --tag=$(TAGGED_IMAGE_NAME) .
