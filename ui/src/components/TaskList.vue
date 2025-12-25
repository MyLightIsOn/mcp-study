<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

const tasks = ref<Task[]>([])
const isConnected = ref(false)
const error = ref<string | null>(null)

let eventSource: EventSource | null = null

const fetchTasks = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/tasks')
    const data = await response.json()
    tasks.value = data.tasks || []
    error.value = null
  } catch (err) {
    error.value = 'Failed to fetch tasks. Make sure the API server is running.'
    console.error('Error fetching tasks:', err)
  }
}

const connectToEvents = () => {
  eventSource = new EventSource('http://localhost:3001/api/events')

  eventSource.onopen = () => {
    isConnected.value = true
    console.log('Connected to real-time updates')
  }

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)

    if (data.type === 'update') {
      tasks.value = data.tasks.tasks || []
      console.log('Tasks updated in real-time')
    }
  }

  eventSource.onerror = () => {
    isConnected.value = false
    console.error('EventSource error')
  }
}

onMounted(async () => {
  await fetchTasks()
  connectToEvents()
})

onUnmounted(() => {
  if (eventSource) {
    eventSource.close()
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}
</script>

<template>
  <div class="task-list">
    <div class="header">
      <h1>📋 MCP Task Manager</h1>
      <div class="status">
        <span class="status-indicator" :class="{ connected: isConnected }"></span>
        {{ isConnected ? 'Live Updates Active' : 'Connecting...' }}
      </div>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="tasks.length === 0 && !error" class="empty">
      No tasks yet. Try adding one through Claude!
    </div>

    <div class="tasks">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="task-card"
        :class="{ completed: task.completed }"
      >
        <div class="task-header">
          <h3>{{ task.title }}</h3>
          <span class="status-badge" :class="{ completed: task.completed }">
            {{ task.completed ? '✓ Completed' : 'Pending' }}
          </span>
        </div>

        <p v-if="task.description" class="description">
          {{ task.description }}
        </p>

        <div class="task-footer">
          <div class="dates">
            <small>Created: {{ formatDate(task.createdAt) }}</small>
            <small v-if="task.createdAt !== task.updatedAt">
              Updated: {{ formatDate(task.updatedAt) }}
            </small>
          </div>
          <div class="task-id">
            <code>{{ task.id.slice(0, 8) }}</code>
          </div>
        </div>
      </div>
    </div>

    <div class="instructions">
      <h3>💡 Try it out!</h3>
      <ul>
        <li>Add a task through Claude: "Add a task to learn Vue.js"</li>
        <li>List tasks: "Show me all my tasks"</li>
        <li>Complete a task: "Mark task [id] as completed"</li>
        <li>Watch this UI update in real-time! ✨</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.task-list {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.header h1 {
  margin: 0;
  color: #111827;
  font-size: 2rem;
}

.status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ef4444;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.status-indicator.connected {
  background-color: #10b981;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.error {
  background-color: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.empty {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  font-size: 1.125rem;
}

.tasks {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.task-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.2s;
}

.task-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.task-card.completed {
  background-color: #f0fdf4;
  border-color: #86efac;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.75rem;
}

.task-header h3 {
  margin: 0;
  color: #111827;
  font-size: 1.25rem;
}

.task-card.completed .task-header h3 {
  text-decoration: line-through;
  color: #6b7280;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.completed {
  background-color: #d1fae5;
  color: #065f46;
}

.description {
  color: #4b5563;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.dates {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dates small {
  color: #6b7280;
  font-size: 0.75rem;
}

.task-id code {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: #374151;
}

.instructions {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-top: 3rem;
}

.instructions h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.instructions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.instructions li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.instructions li:before {
  content: '→';
  position: absolute;
  left: 0;
  font-weight: bold;
}
</style>
