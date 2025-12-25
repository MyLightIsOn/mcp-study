#!/usr/bin/env node

// Simple test to verify the MCP server responds correctly
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, 'run-server.sh');

console.log('Starting MCP server test...');
console.log('Server path:', serverPath);

const server = spawn(serverPath, [], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Send initialize request
const initRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'test-client',
      version: '1.0.0'
    }
  }
};

setTimeout(() => {
  console.log('\nSending initialize request...');
  server.stdin.write(JSON.stringify(initRequest) + '\n');
}, 500);

server.stdout.on('data', (data) => {
  console.log('Server response:', data.toString());
});

server.stderr.on('data', (data) => {
  console.log('Server stderr:', data.toString());
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
});

server.on('close', (code) => {
  console.log('Server exited with code:', code);
  process.exit(code || 0);
});

// Clean up after 5 seconds
setTimeout(() => {
  console.log('\nTest complete, shutting down...');
  server.kill();
}, 5000);
