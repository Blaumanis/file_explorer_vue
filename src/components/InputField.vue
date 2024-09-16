<template>
  <li class="flex items-center gap-[5px] pl-[5px] py-[5px]">
    <component :is="isCreatingFolder ? FolderCloseIcon : FileIcon" />
    <input
      ref="inputRef"
      type="text"
      :value="inputValue"
      @input="handleInputChange"
      :placeholder="isCreatingFolder ? 'Enter folder name' : 'Enter file name'"
      @keydown="handleKeyPress"
      class="text-black placeholder:text-black px-[5px] outline-none rounded-sm"
      minlength="3"
      required
    />
  </li>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue'
import { FileIcon, FolderCloseIcon } from '@/icons/icons'

// Define props for the component
interface InputFieldProps {
  isCreatingFolder: boolean
  isCreatingFile: boolean
  newFolderName: string
  newFileName: string
  handleOnKeyPress: () => void
  handleInputChange: (e: Event) => void
  clearCreationState: () => void
}

const props = defineProps<InputFieldProps>() // Defines props with TypeScript types

// Computed property to determine the current input value (folder name or file name)
const inputValue = computed(() =>
  props.isCreatingFolder ? props.newFolderName : props.newFileName
)

// Reference to the input field DOM element to programmatically set focus
const inputRef = ref<HTMLInputElement | null>(null)

// Handles input changes, passing the event back to the parent component via props
const handleInputChange = (event: Event) => {
  props.handleInputChange(event)
}

// // Handles key press events, checking if the "Enter" or "Escape" key was pressed, and calls the corresponding function
const handleKeyPress = (event: KeyboardEvent) => {
  const input = inputRef.value

  // Handle Enter key
  if (event.key === 'Enter' || event.code === 'Enter') {
    // If the input is invalid, prevent further action and trigger validation
    if (!input?.checkValidity()) {
      input?.reportValidity() // Show the validation message
      return // Exit the function
    }
    props.handleOnKeyPress() // Call the parent method for the Enter key
  }

  // Handle Escape key
  if (event.key === 'Escape' || event.code === 'Escape') {
    props.clearCreationState()
  }
}

// Watch for changes in the `isCreatingFolder` prop
// If the user switches to creating a folder, focus the input field
watch(
  () => props.isCreatingFolder, // Watch the isCreatingFolder prop
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        inputRef.value?.focus() // Focus the input field once the DOM updates
      })
    }
  },
  { immediate: true } // Run the watcher immediately when the component is created
)

watch(
  () => props.isCreatingFile,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        inputRef.value?.focus()
      })
    }
  },
  { immediate: true }
)
</script>
