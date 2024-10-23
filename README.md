# Daytona Docker Extension

Daytona extension for Docker Desktop

## Manual Installation

Until this extension is ready at Docker Extension Hub you can install just by executing:

```bash
make install DAYTONA_VERSION={version}
```

**Note**: Docker Extension CLI is required to execute above command, follow the instructions at [Extension SDK (Beta) -> Prerequisites](https://docs.docker.com/desktop/extensions-sdk/#prerequisites) page for instructions on how to add it.

## Using daytona Docker Extension

Once the extension is installed a new extension is listed at the pane Extensions of Docker Desktop.

## Uninstall

To uninstall the extension just execute:

```bash
make uninstall DAYTONA_VERSION={version}
```

## Source Code

As usual the code of this extension is at [GitHub](https://github.com/daytonaio/daytona-docker-extension)

After the development is done we need to rebuild and update extension
https://docs.docker.com/extensions/extensions-sdk/build/frontend-extension-tutorial/#re-build-the-extension-and-update-it