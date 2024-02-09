import { useEffect, useState } from 'react'
import { useFileSystem } from '.'

export default function useNamedFile(fileName: string) {
  const { fileList, isReady, writeToFile, deleteFile, renameFile } = useFileSystem()
  const [currentFile, setCurrentFile] = useState<FileSystemFileHandle | undefined>()

  useEffect(() => {
    if (!isReady) return

    const index = fileList
      .filter((n) => n.kind === 'file')
      .map((f) => f.name)
      .indexOf(fileName)

    if (index !== -1) setCurrentFile(fileList[index] as FileSystemFileHandle)
  }, [fileList, isReady, fileName])

  return {
    doesExist: currentFile !== undefined,
    renameFile: (newName: string) => {
      return renameFile(fileName, newName)
    },
    writeToFile: async (text: string) => {
      return writeToFile(fileName, text)
    },
    deleteFile: async () => deleteFile(fileName)
  }
}
