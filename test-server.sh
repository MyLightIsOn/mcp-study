#!/bin/bash

# Test script to verify the MCP server works

echo "Testing MCP Server..."
echo ""

# Test that node can run the server
node dist/index.js 2>&1 &
PID=$!

sleep 2

if ps -p $PID > /dev/null 2>&1; then
    echo "✅ Server starts successfully"
    kill $PID 2>/dev/null
else
    echo "❌ Server failed to start"
    exit 1
fi

# Check if index.js has proper shebang
if head -1 dist/index.js | grep -q "^#!"; then
    echo "✅ Shebang found in index.js"
else
    echo "⚠️  No shebang in index.js (this is OK for node command)"
fi

# Verify the file is executable
if [ -x dist/index.js ]; then
    echo "✅ index.js is executable"
else
    echo "⚠️  index.js is not executable (this is OK for node command)"
fi

echo ""
echo "Your config should be:"
echo '{'
echo '  "mcpServers": {'
echo '    "task-manager": {'
echo '      "command": "node",'
echo '      "args": ['
echo "        \"$(pwd)/dist/index.js\""
echo '      ]'
echo '    }'
echo '  }'
echo '}'
