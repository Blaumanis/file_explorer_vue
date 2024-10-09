interface FileNode {
  type: 'file' | 'directory' // node type
  name: string // name of the file or directory
  children?: FileNode[] // optional array of child nodes(only for directories)
}

// Function to structure file paths into a hierarchical tree
export const structureFilePaths = (filepaths: string[]): FileNode[] => {
  // starting point of the tree
  const root: FileNode = { type: 'directory', name: '', children: [] }

  // looping through filepaths []
  filepaths.forEach((path) => {
    // spliting each file path into separate parts by /
    const parts = path.split('/') // 'src/utils/file.ts' becomes ['src', 'utils', 'file.ts']
    let current = root // current pointer is used to track where we are in the tree (starting at the root node).

    // Traverse through each part of the path
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // If it's the last part (i.e., a file):
        // A new FileNode of type file is created and added to the current directory's children array.
        current.children!.push({ type: 'file', name: part })
      } else {
        // Directory part
        // The function checks whether the directory already exists at the current level (using find).
        let dir = current.children!.find(
          (child) => child.type === 'directory' && child.name === part
        )

        // If the directory doesn't exist, it's created and added to the children.
        if (!dir) {
          // If the directory doesn't exist, create it
          dir = { type: 'directory', name: part, children: [] }
          current.children!.push(dir)
        }

        // Move deeper into the directory
        // The current pointer is then moved to this directory so that the
        // next part of the path can be processed inside this directory.
        current = dir
      }
    })
  })

  return root.children || []
}
