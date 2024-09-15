<template>
  <li class="flex items-center gap-[5px] pl-[5px] py-[5px]">
    <component :is="isCreatingFolder ? FolderCloseIcon : FileIcon" />
    <input
      ref="inputRef"
      type="text"
      :value="inputValue"
      @input="handleInputChange"
      :placeholder="isCreatingFolder ? 'Enter folder name' : 'Enter file name'"
      @keypress="handleKeyPress"
      class="text-black placeholder:text-black px-[5px] outline-none rounded-sm"
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
}

const props = defineProps<InputFieldProps>()

const inputValue = computed(() =>
  props.isCreatingFolder ? props.newFolderName : props.newFileName
)

// Add a ref for the input element
const inputRef = ref<HTMLInputElement | null>(null)

// Handle input changes
const handleInputChange = (event: Event) => {
  props.handleInputChange(event)
}

// Handle Enter key press
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    props.handleOnKeyPress()
  }
}

// Watch for changes in isCreatingFolder or isCreatingFile
watch(
  () => props.isCreatingFolder,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        inputRef.value?.focus()
      })
    }
  },
  { immediate: true }
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
