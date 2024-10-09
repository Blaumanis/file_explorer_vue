<template>
  <main class="min-w-[300px] w-[350px] max-h-[400px]">
    <div
      class="flex items-center justify-between bg-slate-200 w-full px-[5px] rounded-tr-md"
    >
      <Title
        :func="handleCollapseFileExplorer"
        :isShowingFileTree="isShowingFileTree"
      />
      <div v-if="isShowingFileTree" class="flex gap-[5px]">
        <Button title="New Folder..." id="folder" :func="handleCreateFolder" />
        <Button title="New File..." id="file" :func="handleCreateFile" />
      </div>
    </div>
    <div
      :class="[
        'overflow-hidden transform origin-top-center',
        isShowingFileTree ? 'openModal' : 'closeModal',
      ]"
    >
      <FileExplorer
        v-if="shouldRenderFileTree"
        :fileTree="fileTree"
        :isCreatingFolder="isCreatingFolder"
        :newFolderName="newFolderName"
        :setNewFolderName="(name) => (newFolderName = name)"
        :handleAddFolder="handleAddFolder"
        :targetDirPath="targetDirPath"
        :setTargetDirPath="(path) => (targetDirPath = path)"
        :newFileName="newFileName"
        :setNewFileName="(name) => (newFileName = name)"
        :isCreatingFile="isCreatingFile"
        :handleAddFile="handleAddFile"
        :clearCreationState="clearCreationState"
        :handleDelete="handleDelete"
        :expandedDirPath="expandedDirPath"
        :setExpandedDirPath="(path) => (expandedDirPath = path)"
      />
    </div>
  </main>
  <Modal v-if="loading || error" :loading="loading" :error="error" />
</template>

<script lang="ts" setup>
import { ref, onMounted, toRaw } from 'vue'
import axios from 'axios'
import type { FileNode } from '@/utils/types'
import { structureFilePaths } from '@/utils/structureFilePaths'
import { useFileTree } from '@/utils/useFileTree'
import FileExplorer from '@/components/FileExplorer.vue'
import Button from '@/components/Button.vue'
import Modal from '@/components/Modal.vue'
import Title from '@/components/Title.vue'

// State management using refs
const { fileTree, saveFileTreeToLocalStorage, addFolder, addFile, deleteNode } =
  useFileTree()
const loading = ref(true)
const error = ref('')
const isCreatingFolder = ref(false)
const newFolderName = ref('')
const isCreatingFile = ref(false)
const newFileName = ref('')
const targetDirPath = ref<string>('root')
const expandedDirPath = ref('root')
const isShowingFileTree = ref(false)
const shouldRenderFileTree = ref(false)

// Fetch file data from API if not available in local storage
const fetchFileData = async () => {
  try {
    const response = await axios.get(
      'https://ab-file-explorer.athleticnext.workers.dev/?file=regular'
    )
    const structuredData = structureFilePaths(response.data.filepaths)
    fileTree.value = structuredData
    localStorage.setItem('fileTree', JSON.stringify(structuredData))
    // loading.value = false // Ensure loading is set to false after data is fetched
  } catch (err) {
    error.value = 'Failed to load file paths.'
    // loading.value = false // Ensure loading is set to false on error as well
  }
}

// Load file tree from local storage on initial render
onMounted(() => {
  const savedFileTree = localStorage.getItem('fileTree')
  if (savedFileTree) {
    fileTree.value = JSON.parse(savedFileTree)
    loading.value = false // Make sure to set loading to false if data is available
  } else {
    fetchFileData()
  }
})

// Add new folder to the selected path
const handleAddFolder = () => {
  const updatedTree: FileNode[] =
    expandedDirPath.value !== 'root'
      ? addFolder(expandedDirPath.value, fileTree.value, newFolderName.value)
      : [
          ...fileTree.value,
          { type: 'directory', name: newFolderName.value, children: [] },
        ]

  fileTree.value = updatedTree
  saveFileTreeToLocalStorage(updatedTree as FileNode[])
  clearCreationState()
}

// Add new file to the selected path
const handleAddFile = () => {
  const updatedTree: FileNode[] =
    expandedDirPath.value !== 'root'
      ? addFile(expandedDirPath.value, fileTree.value, newFileName.value)
      : [...fileTree.value, { type: 'file', name: newFileName.value }]

  fileTree.value = updatedTree
  saveFileTreeToLocalStorage(updatedTree as FileNode[])
  clearCreationState()
}

// Toggle creation state for file or folder
const handleToggleCreation = (type: string) => {
  newFileName.value = ''
  newFolderName.value = ''

  if (type === 'file') {
    isCreatingFile.value = !isCreatingFile.value
    isCreatingFolder.value = false
  } else if (type === 'folder') {
    isCreatingFolder.value = !isCreatingFolder.value
    isCreatingFile.value = false
  }
}

// Toggle folder creation state
const handleCreateFolder = () => {
  handleToggleCreation('folder')
}

// Toggle file creation state
const handleCreateFile = () => {
  handleToggleCreation('file')
}

// Delete file/folder by the selected path
const handleDelete = (path: string) => {
  const updatedTree = deleteNode(fileTree.value, path)
  fileTree.value = updatedTree
  saveFileTreeToLocalStorage(updatedTree as FileNode[])
}

// Toggle File Explorer visibility with animation delay
const handleCollapseFileExplorer = () => {
  if (isShowingFileTree.value) {
    isShowingFileTree.value = false
    setTimeout(() => (shouldRenderFileTree.value = false), 300)
  } else {
    shouldRenderFileTree.value = true
    setTimeout(() => (isShowingFileTree.value = true), 100)
  }
  clearCreationState()
}

// Reset the file and folder creation values
const clearCreationState = () => {
  isCreatingFile.value = false
  isCreatingFolder.value = false
  newFolderName.value = ''
  newFileName.value = ''
}
</script>

<style scoped>
/* animation for toggling file explorer */
.openModal {
  animation: slideDown 0.35s ease-in forwards;
  transform-origin: top center;
}

.closeModal {
  animation: slideUp 0.35s ease-out forwards;
  transform-origin: top center;
}

@keyframes slideDown {
  0% {
    transform: scaleY(0);
    opacity: 0;
  }

  80% {
    transform: scaleY(1.1);
    opacity: 1;
  }

  100% {
    transform: scaleY(1);
    opacity: 1;
  }
}

@keyframes slideUp {
  0% {
    transform: scaleY(1);
    opacity: 1;
  }

  100% {
    transform: scaleY(0);
    opacity: 0;
  }
}
</style>
