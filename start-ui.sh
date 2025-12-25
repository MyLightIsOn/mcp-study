#!/bin/bash

echo "🚀 Starting Task Manager UI..."
echo ""
echo "The UI will be available at: http://localhost:3000"
echo "Press Ctrl+C to stop"
echo ""

cd task-ui-simple
python3 -m http.server 3000
