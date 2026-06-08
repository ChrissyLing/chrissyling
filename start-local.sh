#!/bin/bash
# 本地预览个人网站（路径含空格时，比直接双击 index.html 更稳定）
cd "$(dirname "$0")"
PORT=5500

if lsof -ti:"$PORT" >/dev/null 2>&1; then
  PORT=5501
fi

echo "正在启动本地服务器: http://localhost:$PORT"
echo "按 Ctrl+C 停止"
python3 -m http.server "$PORT" &
SERVER_PID=$!
sleep 0.8
open "http://localhost:$PORT"
wait $SERVER_PID
