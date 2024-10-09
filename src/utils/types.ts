// FileNode structure
export type FileNode = {
  type: 'file' | 'directory'
  name: string
  children?: FileNode[]
}

// API response structure
export type ApiResponse = {
  name: string
  filepaths: string[]
}

// Props for FileExplorer component in Vue
export type FileExplorerProps = {
  fileTree: FileNode[]
  isCreatingFolder: boolean
  newFolderName: string
  isCreatingFile: boolean
  newFileName: string
  targetDirPath: string
  expandedDirPath: string
  setNewFolderName: (name: string) => void
  setNewFileName: (name: string) => void
  handleAddFolder: () => void
  handleAddFile: () => void
  handleDelete: (path: string) => void
  setTargetDirPath: (value: string) => void
  setExpandedDirPath: (value: string) => void
  clearCreationState: () => void
}
