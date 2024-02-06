import { useLocalStorage } from '@uidotdev/usehooks'
import { useState } from 'react'
import { VscNewFile } from 'react-icons/vsc'
import { Resizable, ResizeCallbackData } from 'react-resizable'
import { LOCAL_STORAGE_MAP } from '@/constants'
import { useFileSystem } from '@/hooks'
import { IconButton } from '../UI'
import { Stack } from '../UI/Layout'
import FileItem from './FileItem'
import styles from './FileViewer.module.scss'
import NewFileInput from './NewFileInput'

const { currentFile: currentFileKey } = LOCAL_STORAGE_MAP

export default function FileViewer() {
  const [size, setSize] = useState<ResizeCallbackData['size']>({ width: 250, height: Infinity })
  const [creatingFile, setCreatingFile] = useState<boolean>(false)
  const { fileList, createFile } = useFileSystem()
  const [_, setCurrentFile] = useLocalStorage(currentFileKey)

  // On top layout
  const onResize = (_event: unknown, { size }: ResizeCallbackData) => {
    setSize({ width: size.width, height: size.height })
  }

  const handleCreateEnter = async (newName: string) => {
    createFile(newName).then((success) => {
      if (success) setCurrentFile(newName)
    })
  }

  return (
    <Resizable
      axis='x'
      width={size.width}
      onResize={onResize}
      handle={<div className={styles.handle}></div>}>
      <Stack
        dir='vertical'
        className={styles.fileViewer}
        style={{
          width: `${size.width}px`
        }}>
        <Stack dir='vertical' spacing='none'>
          {fileList
            .filter((f) => f.kind === 'file')
            .map((f) => {
              return <FileItem key={f.name} fileHandle={f as FileSystemFileHandle} />
            })}
          {creatingFile && (
            <NewFileInput
              handleEnter={handleCreateEnter}
              handleBlur={() => setCreatingFile(false)}
            />
          )}
        </Stack>
        <Stack className={styles.fileViewMenu} reverse>
          <IconButton
            title='Create new file'
            size={18}
            icon={VscNewFile}
            onClick={() => setCreatingFile(true)}></IconButton>
        </Stack>
      </Stack>
    </Resizable>
  )
}
