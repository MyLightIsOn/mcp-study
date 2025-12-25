import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Task, TaskStore } from './types.js';

// Get the directory where this script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store data in the project directory (parent of dist/)
const DATA_DIR = path.join(__dirname, '..', 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

export class Storage {
  private store: TaskStore = { tasks: [] };

  async initialize(): Promise<void> {
    // Ensure data directory exists
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }

    // Load existing tasks or create new file
    if (existsSync(TASKS_FILE)) {
      const data = await readFile(TASKS_FILE, 'utf-8');
      this.store = JSON.parse(data);
    } else {
      await this.save();
    }
  }

  private async save(): Promise<void> {
    await writeFile(TASKS_FILE, JSON.stringify(this.store, null, 2), 'utf-8');
  }

  async getTasks(): Promise<Task[]> {
    return this.store.tasks;
  }

  async addTask(title: string, description?: string): Promise<Task> {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.store.tasks.push(task);
    await this.save();
    return task;
  }

  async updateTask(id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'completed'>>): Promise<Task | null> {
    const task = this.store.tasks.find(t => t.id === id);
    if (!task) return null;

    Object.assign(task, updates, { updatedAt: new Date().toISOString() });
    await this.save();
    return task;
  }

  async deleteTask(id: string): Promise<boolean> {
    const index = this.store.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;

    this.store.tasks.splice(index, 1);
    await this.save();
    return true;
  }

  async completeTask(id: string): Promise<Task | null> {
    return this.updateTask(id, { completed: true });
  }
}
