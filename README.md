# Task Manager MCP Server

A Model Context Protocol (MCP) server for managing tasks with JSON persistence and a real-time Vue.js UI.

## Features

- ✅ Add tasks with title and optional description
- ✅ List all tasks or filter by completion status
- ✅ Update task details
- ✅ Mark tasks as completed
- ✅ Delete tasks
- ✅ JSON file persistence (stored in `data/tasks.json`)
- ✅ Real-time Vue.js UI that syncs with MCP changes
- ✅ Live updates using Server-Sent Events (SSE)

## Project Structure

```
mcp-study/
├── src/
│   ├── index.ts         # MCP server
│   ├── storage.ts       # JSON persistence
│   ├── api-server.ts    # REST API + SSE for UI
│   └── types.ts         # TypeScript types
├── ui/                  # Vue.js frontend
│   └── src/
│       └── components/
│           └── TaskList.vue
├── data/                # Task storage
│   └── tasks.json
└── README.md
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
cd ui && npm install && cd ..
```

### 2. Build the MCP Server

```bash
npm run build
```

### 3. Configure Claude Desktop

Add to your `claude_desktop_config.json`:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "task-manager": {
      "command": "/Users/YOUR_USERNAME/.nvm/versions/node/v25.2.1/bin/node",
      "args": ["/absolute/path/to/mcp-study/dist/index.js"]
    }
  }
}
```

Replace the paths with your actual paths. Restart Claude Desktop.

### 4. Start the Demo UI

```bash
./start-demo.sh
```

This starts:
- API server on `http://localhost:3001`
- Vue UI on `http://localhost:5173`

## Usage

### Through Claude (MCP)

Talk to Claude in Claude Desktop:

- **Add a task**: "Add a task to buy groceries"
- **List tasks**: "Show me all my tasks"
- **Update task**: "Update task [id] and change the title"
- **Complete task**: "Mark task [id] as completed"
- **Delete task**: "Delete task [id]"

### Through the UI

1. Open `http://localhost:5173` in your browser
2. Watch tasks appear in real-time as you add them through Claude
3. See live updates when tasks are completed or modified

## The Magic ✨

This demo showcases the power of MCPs:

1. **Conversational Interface**: Manage tasks through natural language with Claude
2. **Visual Interface**: See the same data in a beautiful UI
3. **Real-Time Sync**: Changes from Claude appear instantly in the UI
4. **Shared Data**: Both interfaces read/write to the same `tasks.json` file

Try it:
1. Ask Claude to "Add a task to learn about MCPs"
2. Watch it appear in the UI instantly
3. The UI updates in real-time via Server-Sent Events!

## Development

### Run MCP Server Only
```bash
npm run dev
```

### Run API Server Only
```bash
npm run api
```

### Run Vue UI Only
```bash
cd ui && npm run dev
```

### Build for Production
```bash
npm run build
```
