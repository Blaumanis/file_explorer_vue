<template>
  <div>
    <ul class="px-[5px] rounded-br-md bg-[#202020]">
      <li
        v-for="node in fileTree"
        :key="node.name"
        class="group text-[#fff] py-[4px] select-none"
      >
        <span
          @click="
            () => {
              const fullPath = getNodeKey(node.name, parentPath)
              props.setExpandedDirPath(fullPath)
              toggleExpand(node.name, node.type === 'directory')
            }
          "
          @contextmenu.prevent="
            handleRightClick($event, node, getNodeKey(node.name, parentPath))
          "
          class="fileItem cursor-pointer flex items-center gap-[4px] hover:bg-sky-700 rounded px-[2px]"
        >
          <component :is="getArrowIcon(node)" v-if="getArrowIcon(node)" />
          <component :is="getIcon(node)" />
          {{ node.name }}
        </span>

        <ul v-if="isNodeExpanded(node.name)" class="pl-[20px]">
          <FileExplorer
            v-for="child in node.children"
            :key="child.name"
            :fileTree="[child]"
            :isCreatingFolder="isCreatingFolder"
            :newFolderName="newFolderName"
            :newFileName="newFileName"
            :targetDirPath="targetDirPath"
            :setTargetDirPath="setTargetDirPath"
            :setExpandedDirPath="setExpandedDirPath"
            :handleDelete="handleDelete"
            :clearCreationState="clearCreationState"
            :handleAddFolder="handleAddFolder"
            :handleAddFile="handleAddFile"
            :setNewFolderName="setNewFolderName"
            :setNewFileName="setNewFileName"
            :isCreatingFile="isCreatingFile"
            :expandedDirPath="expandedDirPath"
            :parentPath="getNodeKey(node.name, parentPath)"
            @right-click="
              (event) => {
                const fullPath = getNodeKey(
                  child.name,
                  getNodeKey(node.name, parentPath)
                )
                handleRightClick(event, child, fullPath)
              }
            "
          />
          <InputField
            v-if="
              (isCreatingFolder || isCreatingFile) &&
              targetDirPath === node.name
            "
            :isCreatingFolder="isCreatingFolder"
            :isCreatingFile="isCreatingFile"
            :newFolderName="newFolderName"
            :newFileName="newFileName"
            :handleInputChange="handleInputChange"
            :handleOnKeyPress="handleOnKeyPress"
          />
        </ul>
      </li>

      <!-- Render input field in the root directory -->
      <InputField
        v-if="(isCreatingFolder || isCreatingFile) && targetDirPath === 'root'"
        :isCreatingFolder="isCreatingFolder"
        :isCreatingFile="isCreatingFile"
        :newFolderName="newFolderName"
        :newFileName="newFileName"
        :handleInputChange="handleInputChange"
        :handleOnKeyPress="handleOnKeyPress"
      />
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import InputField from './InputField.vue'
import icons from '@/icons/iconsList'
import type { FileNode, FileExplorerProps } from '@/utils/types'

// Define props and emits
const props = defineProps<FileExplorerProps & { parentPath?: string }>()
const emits = defineEmits(['toggle-expand', 'right-click', 'render-node'])

// Use reactive to manage expanded state
const expanded = reactive<Record<string, boolean>>({})

const getNodeKey = (name: string, parentPath?: string) => {
  const normalizedParentPath = parentPath || '' // Handle undefined case explicitly
  if (normalizedParentPath.endsWith(name)) {
    return normalizedParentPath
  }
  return normalizedParentPath ? `${normalizedParentPath}/${name}` : name
}

// Toggle expand functionality
const toggleExpand = (path: string, isDirectory: boolean) => {
  // Clear states for folder or file creating when expanding folders
  props.clearCreationState()

  const isCurrentlyExpanded = expanded[path]

  if (isDirectory) {
    if (!isCurrentlyExpanded) {
      // Expanding a directory
      props.setTargetDirPath(path)
    } else {
      // Collapsing a directory
      const parentPath = path.substring(0, path.lastIndexOf('/')) || 'root'
      if (props.targetDirPath.startsWith(path)) {
        props.setTargetDirPath(parentPath)
      }
    }
  }

  // Update expanded state
  expanded[path] = !isCurrentlyExpanded
}

// Check if a node is expanded
const isNodeExpanded = (name: string) => !!expanded[name]

// Get icon based on file type
const getIcon = (node: FileNode) => {
  const extension = node.name.split('.').pop()
  return node.type === 'directory'
    ? icons[node.name] ||
        (isNodeExpanded(node.name)
          ? icons['directoryOpen']
          : icons['directoryClosed'])
    : icons[`.${extension}`] || icons[node.name] || icons['file']
}

// Get arrow icon for directory expansion
const getArrowIcon = (node: FileNode) => {
  return node.type === 'directory'
    ? isNodeExpanded(node.name)
      ? icons['downArrow']
      : icons['rightArrow']
    : null
}

// Handle right-click event for file deletion
const handleRightClick = (
  event: MouseEvent,
  node: FileNode,
  parentPath: string
) => {
  const fullPath = getNodeKey(node.name, parentPath || '')
  if (window.confirm(`Are you sure you want to delete ${fullPath}?`)) {
    props.handleDelete(fullPath)
  }
}

// Handle input change for file/folder creation
const handleInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (props.isCreatingFolder) {
    props.setNewFolderName(target.value)
  } else {
    props.setNewFileName(target.value)
  }
}

// Handle key press for file/folder creation
const handleOnKeyPress = () => {
  if (props.isCreatingFolder) {
    props.handleAddFolder()
  } else {
    props.handleAddFile()
  }
}
</script>
