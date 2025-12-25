#!/bin/bash

echo "Starting MCP Task Manager Demo..."
echo ""

# Start API server
echo "Starting API server on port 3001..."
npm run api &
API_PID=$!

# Wait a bit for API to start
sleep 2

# Start Vue dev server
echo "Starting Vue UI on port 5173..."
cd ui && npm run dev &
UI_PID=$!

echo ""
echo "✅ Demo started successfully!"
echo ""
echo "📡 API Server: http://localhost:3001"
echo "🎨 Vue UI: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $API_PID $UI_PID; exit" INT
wait
