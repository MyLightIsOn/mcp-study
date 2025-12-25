#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { Storage } from './storage.js';

// Define our tools
const TOOLS: Tool[] = [
  {
    name: 'add_task',
    description: 'Add a new task to the task list',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The title of the task',
        },
        description: {
          type: 'string',
          description: 'Optional description of the task',
        },
      },
      required: ['title'],
    },
  },
  {
    name: 'list_tasks',
    description: 'List all tasks, optionally filtered by completion status',
    inputSchema: {
      type: 'object',
      properties: {
        completed: {
          type: 'boolean',
          description: 'Filter by completion status (true for completed, false for incomplete, omit for all)',
        },
      },
    },
  },
  {
    name: 'update_task',
    description: 'Update an existing task',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The ID of the task to update',
        },
        title: {
          type: 'string',
          description: 'New title for the task',
        },
        description: {
          type: 'string',
          description: 'New description for the task',
        },
        completed: {
          type: 'boolean',
          description: 'New completion status',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'delete_task',
    description: 'Delete a task by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The ID of the task to delete',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'complete_task',
    description: 'Mark a task as completed',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The ID of the task to complete',
        },
      },
      required: ['id'],
    },
  },
];

// Create server instance
const server = new Server(
  {
    name: 'task-manager',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize storage
const storage = new Storage();

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    return {
      content: [
        {
          type: 'text',
          text: 'No arguments provided',
        },
      ],
      isError: true,
    };
  }

  try {
    switch (name) {
      case 'add_task': {
        const task = await storage.addTask(
          args.title as string,
          args.description as string | undefined
        );
        return {
          content: [
            {
              type: 'text',
              text: `Task created successfully:\n${JSON.stringify(task, null, 2)}`,
            },
          ],
        };
      }

      case 'list_tasks': {
        let tasks = await storage.getTasks();
        
        // Filter by completion status if specified
        if (args.completed !== undefined) {
          tasks = tasks.filter(t => t.completed === args.completed);
        }

        return {
          content: [
            {
              type: 'text',
              text: tasks.length > 0
                ? JSON.stringify(tasks, null, 2)
                : 'No tasks found',
            },
          ],
        };
      }

      case 'update_task': {
        const updates: any = {};
        if (args.title !== undefined) updates.title = args.title;
        if (args.description !== undefined) updates.description = args.description;
        if (args.completed !== undefined) updates.completed = args.completed;

        const task = await storage.updateTask(args.id as string, updates);
        
        if (!task) {
          return {
            content: [
              {
                type: 'text',
                text: `Task with ID ${args.id} not found`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `Task updated successfully:\n${JSON.stringify(task, null, 2)}`,
            },
          ],
        };
      }

      case 'delete_task': {
        const deleted = await storage.deleteTask(args.id as string);
        
        if (!deleted) {
          return {
            content: [
              {
                type: 'text',
                text: `Task with ID ${args.id} not found`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `Task ${args.id} deleted successfully`,
            },
          ],
        };
      }

      case 'complete_task': {
        const task = await storage.completeTask(args.id as string);
        
        if (!task) {
          return {
            content: [
              {
                type: 'text',
                text: `Task with ID ${args.id} not found`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `Task completed:\n${JSON.stringify(task, null, 2)}`,
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  await storage.initialize();
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('Task Manager MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
