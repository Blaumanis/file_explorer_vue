import { ref } from 'vue'
import type { FileNode } from '@/utils/types'

// Define a custom Composition API hook for managing file tree operations
export function useFileTree() {
  // Create a reactive reference to hold the file tree data
  const fileTree = ref<FileNode[]>([])

  // Function to save the current file tree to localStorage
  const saveFileTreeToLocalStorage = (tree: FileNode[]) => {
    // Convert the tree to a JSON string and store it in localStorage
    localStorage.setItem('fileTree', JSON.stringify(tree))
  }

  // Function to add a new folder to the file tree
  const addFolder = (
    targetPath: string, // The path where the folder should be added
    nodes: FileNode[], // The current file tree or subtree
    folderName: string, // The name of the new folder
    currentPath = '' // The current path being processed (used for recursion)
  ): FileNode[] => {
    // Map over each node in the current subtree
    return nodes.map((node) => {
      // Construct the full path of the current node
      const fullPath = currentPath ? `${currentPath}/${node.name}` : node.name

      // If the current node is a directory and its path matches the target path
      if (node.type === 'directory' && fullPath === targetPath) {
        // Return a new node object with the new folder added to its children
        return {
          ...node,
          children: node.children
            ? [
                ...node.children, // Existing children
                { type: 'directory', name: folderName, children: [] }, // New folder
              ]
            : [{ type: 'directory', name: folderName, children: [] }], // New folder (no existing children)
        }
      }

      // If the current node is a directory and has children, recurse into its children
      if (node.type === 'directory' && node.children) {
        return {
          ...node,
          children: addFolder(targetPath, node.children, folderName, fullPath), // Recursive call
        }
      }

      // If no conditions are met, return the node unchanged
      return node
    })
  }

  // Function to add a new file to the file tree
  const addFile = (
    targetPath: string, // The path where the file should be added
    nodes: FileNode[], // The current file tree or subtree
    fileName: string, // The name of the new file
    currentPath = '' // The current path being processed (used for recursion)
  ): FileNode[] => {
    // Map over each node in the current subtree
    return nodes.map((node) => {
      // Construct the full path of the current node
      const fullPath = currentPath ? `${currentPath}/${node.name}` : node.name

      // If the current node is a directory and its path matches the target path
      if (node.type === 'directory' && fullPath === targetPath) {
        // Return a new node object with the new file added to its children
        return {
          ...node,
          children: node.children
            ? [...node.children, { type: 'file', name: fileName }] // New file
            : [{ type: 'file', name: fileName }], // New file (no existing children)
        }
      }

      // If the current node is a directory and has children, recurse into its children
      if (node.type === 'directory' && node.children) {
        return {
          ...node,
          children: addFile(targetPath, node.children, fileName, fullPath), // Recursive call
        }
      }

      // If no conditions are met, return the node unchanged
      return node
    })
  }

  const deleteNode = (
    nodes: FileNode[], // The current file tree or subtree
    pathToDelete: string, // The full path of the node to delete
    parentPath: string = '' // The path of the parent node (used for recursion)
  ): FileNode[] => {
    return nodes.reduce<FileNode[]>((result, node) => {
      // Construct the full path of the current node
      const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name

      // If the full path matches the path to delete, skip this node
      if (fullPath === pathToDelete) {
        return result // Skip this node, effectively deleting it
      }

      // If the current node is a directory and has children, recurse into its children
      if (node.type === 'directory' && node.children) {
        // Recursively delete the node from its children
        const filteredChildren = deleteNode(
          node.children,
          pathToDelete,
          fullPath
        )

        // Only push the directory back if it has remaining children or wasn't the target
        result.push({ ...node, children: filteredChildren })
      } else {
        // If it's a file or directory without children, add it to the result as is
        result.push(node)
      }

      return result
    }, [])
  }

  // // Function to delete a node from the file tree
  // const deleteNode = (
  //   nodes: FileNode[], // The current file tree or subtree
  //   pathToDelete: string, // The path of the node to delete
  //   parentPath: string = '' // The path of the parent node (used for recursion)
  // ): FileNode[] => {
  //   // Reduce the nodes to a new array, excluding the node to delete
  //   return nodes.reduce<FileNode[]>((result, node) => {
  //     // Construct the full path of the current node
  //     const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name

  //     // If the full path matches the path to delete, skip this node
  //     if (fullPath === pathToDelete) {
  //       return result // Skip this node
  //     }

  //     // If the current node is a directory and has children, recurse into its children
  //     if (node.type === 'directory' && node.children) {
  //       // Filter out the deleted node from the children
  //       const filteredChildren = deleteNode(
  //         node.children,
  //         pathToDelete,
  //         fullPath // Pass the current path as the new parent path
  //       )
  //       // Add the current node with the filtered children to the result
  //       result.push({ ...node, children: filteredChildren })
  //     } else {
  //       // Add the current node to the result
  //       result.push(node)
  //     }

  //     return result
  //   }, [])
  // }

  // Return the reactive state and functions for use
  return {
    fileTree,
    saveFileTreeToLocalStorage,
    addFolder,
    addFile,
    deleteNode,
  }
}
