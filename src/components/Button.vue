<template>
  <button class="btn" :id="id" :title="title" @click="handleClick">
    <component :is="iconComponent" fill="#202020" />
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { NewFileIcon, NewFolderIcon } from '@/icons/icons' // Adjust the import path based on your project structure

// Define the props interface similar to the React code
interface CreateButtonProps {
  func: () => void
  title: string
  id: string
}

// Extract props using defineProps
const props = defineProps<CreateButtonProps>()

// Computed property to determine which icon to render
const iconComponent = computed(() =>
  props.id === 'folder' ? NewFolderIcon : NewFileIcon
)

// Method to handle button click and execute the passed function
const handleClick = () => {
  props.func()
}
</script>
