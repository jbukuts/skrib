import { useEffect, useState } from 'react'
import { Input } from '@/components/UI'
import { useFileSystem } from '@/hooks'
import styles from './NewFileInput.module.scss'

interface NewFileItemProps {
  startingName?: string
  handleBlur: () => void
  handleEnter: (_s: string) => void
}

export default function NewFileInput(props: NewFileItemProps) {
  const { startingName = '', handleBlur, handleEnter } = props
  const [newName, setNewName] = useState<string>(startingName)
  const [badName, setBadName] = useState<boolean>(false)
  const { doesAlreadyExist } = useFileSystem()

  useEffect(() => {
    if (newName === startingName) return
    setBadName(doesAlreadyExist(newName) || !newName)
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
