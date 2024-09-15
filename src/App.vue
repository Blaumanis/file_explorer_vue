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
    <Modal v-if="loading || error" :loading="loading" :error="error" />
  </main>
</template>

<script lang="ts" setup>
import { ref, onMounted, toRaw } from 'vue'
import axios from 'axios'
import type { FileNode } from '@/utils/types'
import { structureFilePaths } from '@/utils/structureFilePaths'
import FileExplorer from '@/components/FileExplorer.vue'
import Button from '@/components/Button.vue'
import Modal from '@/components/Modal.vue'
import Title from '@/components/Title.vue'

// State management using refs
const fileTree = ref([])
const loading = ref(true)
const error = ref(null)
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
    loading.value = false // Ensure loading is set to false after data is fetched
  } catch (err) {
    error.value = 'Failed to load file paths.'
    loading.value = false // Ensure loading is set to false on error as well
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

// Save file tree to local storage
const saveFileTreeToLocalStorage = (tree) => {
  localStorage.setItem('fileTree', JSON.stringify(tree))
}

// Handle adding a new folder to the correct path within the file tree
const addFolder = (
  targetPath: string,
  nodes: FileNode[],
  folderName: string,
  currentPath = ''
): FileNode[] => {
  return nodes.map((node) => {
    const fullPath = currentPath ? `${currentPath}/${node.name}` : node.name

    if (node.type === 'directory' && fullPath === targetPath) {
      return {
        ...node,
        children: node.children
          ? [
              ...node.children,
              { type: 'directory', name: folderName, children: [] },
            ]
          : [{ type: 'directory', name: folderName, children: [] }],
      }
    }

    if (node.type === 'directory' && node.children) {
      return {
        ...node,
        children: addFolder(targetPath, node.children, folderName, fullPath),
      }
    }

    return node
  })
}

// Add new folder to the selected path
const handleAddFolder = () => {
  const updatedTree =
    expandedDirPath.value !== 'root'
      ? addFolder(expandedDirPath.value, fileTree.value, newFolderName.value)
      : [
          ...fileTree.value,
          { type: 'directory', name: newFolderName.value, children: [] },
        ]

  fileTree.value = updatedTree
  saveFileTreeToLocalStorage(updatedTree)
  resetFolderCreationState()
}

// Reset state after folder creation
const resetFolderCreationState = () => {
  isCreatingFolder.value = false
  newFolderName.value = ''
}

// Handle adding a new file to the correct path within the file tree
const addFile = (
  targetPath: string,
  nodes: FileNode[],
  fileName: string,
  currentPath = ''
): FileNode[] => {
  return nodes.map((node) => {
    const fullPath = currentPath ? `${currentPath}/${node.name}` : node.name

    if (node.type === 'directory' && fullPath === targetPath) {
      return {
        ...node,
        children: node.children
          ? [...node.children, { type: 'file', name: fileName }]
          : [{ type: 'file', name: fileName }],
      }
    }

    if (node.type === 'directory' && node.children) {
      return {
        ...node,
        children: addFile(targetPath, node.children, fileName, fullPath),
      }
    }

    return node
  })
}

const handleAddFile = () => {
  const updatedTree =
    expandedDirPath.value !== 'root'
      ? addFile(expandedDirPath.value, fileTree.value, newFileName.value)
      : [...fileTree.value, { type: 'file', name: newFileName.value }]

  fileTree.value = updatedTree
  saveFileTreeToLocalStorage(updatedTree)
  resetFileCreationState()
}

// Reset state after file creation
const resetFileCreationState = () => {
  isCreatingFile.value = false
  newFileName.value = ''
}

// Toggle folder creation state
const handleCreateFolder = () => {
  newFileName.value = ''
  newFolderName.value = ''
  isCreatingFolder.value = !isCreatingFolder.value
  isCreatingFile.value = false
}

// Toggle file creation state
const handleCreateFile = () => {
  newFolderName.value = ''
  newFileName.value = ''
  isCreatingFile.value = !isCreatingFile.value
  isCreatingFolder.value = false
}

const clearCreationState = () => {
  isCreatingFile.value = false
  isCreatingFolder.value = false
}

// Delete a node by path
const deleteNode = (
  nodes: FileNode[],
  pathToDelete: string,
  parentPath: string = ''
): FileNode[] => {
  return nodes.reduce<FileNode[]>((result, node) => {
    const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name

    if (fullPath === pathToDelete) {
      return result // Skip this node
    }

    // Recursively check children if it's a directory
    if (node.type === 'directory' && node.children) {
      const filteredChildren = deleteNode(node.children, pathToDelete, fullPath)
      result.push({ ...node, children: filteredChildren })
    } else {
      result.push(node)
    }

    return result
  }, [])
}

const handleDelete = (path: string) => {
  const updatedTree = deleteNode(fileTree.value, path)
  fileTree.value = updatedTree
  saveFileTreeToLocalStorage(updatedTree)
}

// Toggle File Explorer visibility with animation delay
const handleCollapseFileExplorer = () => {
  if (isShowingFileTree.value) {
    isShowingFileTree.value = false
    setTimeout(() => (shouldRenderFileTree.value = false), 300)
  } else {
    shouldRenderFileTree.value = true
    setTimeout(() => (isShowingFileTree.value = true), 10)
  }
  isCreatingFolder.value = false
  isCreatingFile.value = false
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
