#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SITE_ROOT="$(dirname "$SCRIPT_DIR")"
PORT=5500

if lsof -ti:"$PORT" >/dev/null 2>&1; then
  PORT=5501
fi

cd "$SITE_ROOT"
echo "正在打开选校决策页：http://localhost:$PORT/selection/"
python3 -m http.server "$PORT" &
SERVER_PID=$!
sleep 0.8
open "http://localhost:$PORT/selection/"

trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT INT TERM
wait "$SERVER_PID"
