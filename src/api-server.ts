import express from 'express';
import cors from 'cors';
import { watch } from 'chokidar';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Store for SSE clients
const clients: Set<express.Response> = new Set();

app.use(cors());
app.use(express.json());

// Get the tasks file path
const TASKS_FILE = path.join(__dirname, '..', 'data', 'tasks.json');

// GET /api/tasks - Return current tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const data = await readFile(TASKS_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read tasks' });
  }
});

// GET /api/events - Server-Sent Events for real-time updates
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Add this client to the set
  clients.add(res);

  // Send initial connection message
  res.write('data: {"type":"connected"}\n\n');

  // Remove client when connection closes
  req.on('close', () => {
    clients.delete(res);
  });
});

// Watch for file changes
const watcher = watch(TASKS_FILE);

watcher.on('change', async () => {
  try {
    const data = await readFile(TASKS_FILE, 'utf-8');
    const tasks = JSON.parse(data);

    // Notify all connected clients
    const message = `data: ${JSON.stringify({ type: 'update', tasks })}\n\n`;
    clients.forEach(client => {
      client.write(message);
    });

    console.log('Tasks updated, notified', clients.size, 'clients');
  } catch (error) {
    console.error('Error reading tasks file:', error);
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Watching for changes in: ${TASKS_FILE}`);
});
