#!/bin/bash

# Check machine architecture
ARCH=$(uname -m)

case $ARCH in
"arm64" | "ARM64" | "aarch64")
  ARCH="arm64"
  ;;
"x86_64" | "AMD64")
  ARCH="amd64"
  ;;
*)
  err "Unsupported architecture: $ARCH"
  ;;
esac

mkdir -p /linux /darwin /windows
BASE_URL="https://download.daytona.io/daytona"

curl -fsSL "$BASE_URL/v$DAYTONA_VERSION/daytona-windows-$ARCH.exe" -o "/windows/daytona.exe" && chmod +x /windows/daytona.exe
curl -fsSL "$BASE_URL/v$DAYTONA_VERSION/daytona-linux-$ARCH" -o "/linux/daytona" && chmod +x /linux/daytona
curl -fsSL "$BASE_URL/v$DAYTONA_VERSION/daytona-darwin-$ARCH" -o "/darwin/daytona" && chmod +x /darwin/daytona