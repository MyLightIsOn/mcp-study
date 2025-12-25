# Task Manager MCP Server

A Model Context Protocol (MCP) server for managing tasks with JSON persistence.

## Features

- ✅ Add tasks with title and optional description
- ✅ List all tasks or filter by completion status
- ✅ Update task details
- ✅ Mark tasks as completed
- ✅ Delete tasks
- ✅ JSON file persistence (stored in `data/tasks.json`)

## Installation

```bash
npm install
```

## Usage

### Development Mode

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## Available Tools

### 1. `add_task`
Add a new task to the task list.

**Parameters:**
- `title` (string, required): The title of the task
- `description` (string, optional): Additional details about the task

**Example:**
```
Add a task to buy groceries
```

### 2. `list_tasks`
List all tasks, optionally filtered by completion status.

**Parameters:**
- `completed` (boolean, optional): Filter by completion status
  - `true`: Show only completed tasks
  - `false`: Show only incomplete tasks
  - Omit: Show all tasks

**Example:**
```
Show me all my incomplete tasks
```

### 3. `update_task`
Update an existing task's details.

**Parameters:**
- `id` (string, required): The task ID
- `title` (string, optional): New title
- `description` (string, optional): New description
- `completed` (boolean, optional): New completion status

**Example:**
```
Update task abc-123 to change the title to "Buy organic groceries"
```

### 4. `complete_task`
Mark a task as completed.

**Parameters:**
- `id` (string, required): The task ID

**Example:**
```
Mark task abc-123 as completed
```

### 5. `delete_task`
Delete a task permanently.

**Parameters:**
- `id` (string, required): The task ID

**Example:**
```
Delete task abc-123
```

## Configuration for Claude Desktop

To use this MCP server with Claude Desktop, add the following to your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "task-manager": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-study/dist/index.js"]
    }
  }
}
```

Replace `/absolute/path/to/mcp-study` with the actual path to this project.

## Data Storage

Tasks are stored in `data/tasks.json` in the following format:

```json
{
  "tasks": [
    {
      "id": "uuid-here",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

## Next Steps

After building the MCP server, you can:
1. Test it with the MCP Inspector
2. Configure it in Claude Desktop
3. Build a UI to visualize and manage tasks in real-time
