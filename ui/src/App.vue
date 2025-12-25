<script setup lang="ts">
import TaskList from './components/TaskList.vue'
</script>

<template>
  <TaskList />
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

#app {
  background: #f9fafb;
  min-height: calc(100vh - 4rem);
  border-radius: 1rem;
}
</style>

