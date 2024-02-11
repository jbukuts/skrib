import { useEffect, useState } from 'react'
import { VscFile, VscFolder } from 'react-icons/vsc'
import { Input } from '@/components/UI'
import { useFileSystem } from '@/hooks'
import styles from './NewFileInput.module.scss'

interface NewFileItemProps {
  type?: 'file' | 'folder'
  fromPath?: string
  startingName?: string
  handleBlur: () => void
  handleEnter: (_s: string) => void
}

const VALID_FILE_REGEX = new RegExp(/^([a-z0-9]|_|-|\s)+$/i)
const ERROR_REASONS = {
  duplicate: 'A file by the this name already exists.',
  invalidName: 'File names can only contains alphanumeric characters, hyphens, or underscores.'
}

export default function NewFileInput(props: NewFileItemProps) {
  const { type = 'file', fromPath = '', startingName = '', handleBlur, handleEnter } = props
  const [newName, setNewName] = useState<string>(startingName)
  const [badName, setBadName] = useState<boolean>(false)
  const [_errorReason, setErrorReason] = useState<string>()
  const { fileListTest, folderListTest } = useFileSystem()

  useEffect(() => {
    if (newName === startingName) return

    const invalidName = !VALID_FILE_REGEX.test(newName)
    if (invalidName) {
      setBadName(true)
      setErrorReason(ERROR_REASONS.invalidName)
      return
    }

    const listOfInterest = type == 'file' ? fileListTest : folderListTest
    const isDuplicate =
      listOfInterest.indexOf(`${fromPath}/${newName}${type == 'file' ? '.md' : ''}`) > -1
    if (isDuplicate) {
      setBadName(true)
      setErrorReason(ERROR_REASONS.duplicate)
      return
    }

    setBadName(false)
  }, [newName])

  // watch for enter and escape keys
  const watchKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleBlur()
    }

    if (e.key === 'Enter') {
      if (badName) return
      if (newName !== startingName) handleEnter(newName)
      handleBlur()
    }
  }

  return (
    <Input
      startAdornment={type === 'file' ? <VscFile /> : <VscFolder />}
      className={styles.renameInput}
      error={badName}
      autoFocus
      value={newName}
      onChange={(e) => setNewName(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={watchKeys}
    />
  )
}
