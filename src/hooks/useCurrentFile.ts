import { useLocalStorage } from '@uidotdev/usehooks'
import { LOCAL_STORAGE_MAP } from '@/constants'
import { useNamedFile } from '.'

const { currentFile: currentFileKey, localText: localTextKey } = LOCAL_STORAGE_MAP

export default function useCurrentFile() {
  const [currentFile, setCurrentFile] = useLocalStorage<string>(currentFileKey)
  const [localText] = useLocalStorage<string>(localTextKey)
  const { writeToFile, doesExist } = useNamedFile(currentFile)

  return {
    doesExist,
    currentFileName: currentFile,
    setCurrentFile,
    saveCurrentFile: () => writeToFile(localText),
    writeToFile: (text: string) => writeToFile(text)
  }
}
