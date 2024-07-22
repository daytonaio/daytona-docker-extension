#!/bin/bash

# Define the URL to check
url="http://localhost:3986/health"

# Set the maximum number of retries (optional, default 10)
retries=${1:-10}

# Define the wait time between retries (optional, default 5 seconds)
wait_time=${2:-5}

# Loop until successful GET or reach maximum retries
for (( i=0; i<$retries; i++ )); do
  # Suppress output and headers, just get the HTTP code
  http_code=$(curl -s -o /dev/null -w %{http_code} "$url")

  # Check if HTTP code is 200 (OK)
  if [[ $http_code == 200 ]]; then
    echo "Success! Got 200 OK from $url after $((i + 1)) attempts."
    exit 0
  fi

  # Print info about the attempt and wait before retrying
  echo "Attempt $((i + 1)) failed. Received code: $http_code"
  echo "Waiting $wait_time seconds before retrying..."
  sleep "$wait_time"
done

# If loop finishes without success, indicate failure
echo "Error: Could not reach $url after $retries retries."
exit 1
