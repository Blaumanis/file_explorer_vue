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
  setNewFolderName: (name: string) => void
  handleAddFolder: (path: string) => void
  handleAddFile: (path: string) => void
  newFileName: string
  setNewFileName: (name: string) => void
  isCreatingFile: boolean
  targetDirPath: string
  setTargetDirPath: (value: string) => void
  setExpandedDirPath: (value: string) => void
  clearCreationState: () => void
  handleDelete: (path: string) => void
  expandedDirPath: string
}
