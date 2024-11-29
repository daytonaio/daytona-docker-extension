#!/bin/sh

daytona_path=$(find . -name daytona -type f)

DAYTONA_TELEMETRY_ENABLED=false $daytona_path config --format json -k