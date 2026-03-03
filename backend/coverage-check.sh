#!/usr/bin/env bash
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <coverage-file> <minimum-percentage>"
  echo "Example: $0 coverage.out 85"
  exit 1
fi

FILE="$1"
MIN="$2"

if [ ! -f "$FILE" ]; then
  echo "Coverage file '$FILE' not found."
  exit 1
fi

COVERAGE=$(go tool cover -func="$FILE" | grep total | awk '{print $3}' | sed 's/%//')

if (($(echo "$COVERAGE < $MIN" | bc -l))); then
  echo "❌ Coverage $COVERAGE% is below minimum $MIN%"
  exit 1
fi

echo "✅ Coverage $COVERAGE% meets minimum $MIN%"
