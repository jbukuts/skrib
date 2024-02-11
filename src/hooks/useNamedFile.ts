import { useEffect, useState } from 'react'
import { useFileSystem } from '.'

export default function useNamedFile(filePath: string) {
  const { isReady, writeToFileByPath, deleteItemByPath, moveFile, getFileByPath } = useFileSystem()
  const [currentFile, setCurrentFile] = useState<FileSystemFileHandle | undefined>()

  useEffect(() => {
    if (!isReady) return

    getFileByPath(filePath).then((handle) => {
      console.log('got the file', filePath)
      setCurrentFile(handle)
    })
  }, [isReady, filePath])

  return {
    doesExist: currentFile !== undefined,
    moveFile: (newPath: string) => {
      return moveFile(filePath, newPath)
    },
    writeToFile: async (text: string) => {
      return writeToFileByPath(filePath, text)
    },
    deleteFile: async () => deleteItemByPath(filePath)
  }
}
