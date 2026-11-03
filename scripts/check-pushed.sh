#!/bin/sh
# Deploy nur von einem sauberen, gepushten Stand (CLAUDE.md: erst Push, dann publish).
if [ -n "$(git status --porcelain)" ]; then
  echo "check-pushed: Arbeitsverzeichnis nicht sauber. Erst committen." >&2
  exit 1
fi
git fetch --quiet origin 2>/dev/null
if ! upstream=$(git rev-parse --verify --quiet '@{u}'); then
  echo "check-pushed: Branch hat keinen Upstream. Erst pushen." >&2
  exit 1
fi
if [ "$(git rev-parse HEAD)" != "$upstream" ]; then
  echo "check-pushed: HEAD ist nicht gepusht oder nicht aktuell. Erst pushen bzw. pullen." >&2
  exit 1
fi
echo "check-pushed: ok"
