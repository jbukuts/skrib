import { useLocalStorage } from '@uidotdev/usehooks'
import cx from 'classnames'
import { Suspense, lazy, useState } from 'react'
import { Item, ItemParams, ItemProps, Menu, Separator, useContextMenu } from 'react-contexify'
import { createPortal } from 'react-dom'
import { LOCAL_STORAGE_MAP } from '@/constants'
import { useFileSystem } from '@/hooks'
import styles from './FileItem.module.scss'
import 'react-contexify/ReactContexify.css'

const NewFileInput = lazy(() => import('../NewFileInput'))

const { localText: localTextKey, currentFile: currentFileKey } = LOCAL_STORAGE_MAP

interface FileItemProps {
  fileHandle: FileSystemFileHandle
  rename?: boolean
}

function Portal({ children }: { children: React.ReactNode }) {
  return createPortal(children, document.body)
}

export default function FileItem(props: FileItemProps) {
  const { fileHandle = { name: '' } } = props
  const [renaming, setRenaming] = useState<boolean>(false)
  const [currentFile, setCurrentFile] = useLocalStorage<string>(currentFileKey)
  const [localText] = useLocalStorage<string>(localTextKey)
  const { getFileText, deleteFile, renameFile, writeToFile, fileList } = useFileSystem()
  const { show } = useContextMenu({
    id: fileHandle.name
  })

  const handleContextMenu = (event: React.MouseEvent) => {
    show({
      event,
      props: {
        key: 'value'
      }
    })
  }

  // handle swapping current file
  const openFile = async () => {
    if (fileHandle.name == currentFile) return
    writeToFile(currentFile, localText).then((success) => {
      if (success) setCurrentFile(fileHandle.name)
    })
  }

  // various funcs for context menu
  const handlerMap: Record<string, () => void> = {
    delete: async () => {
      const currentIndex = fileList.map((f) => f.name).indexOf(fileHandle.name)
      const newIndex = currentIndex === fileList.length - 1 ? currentIndex - 1 : currentIndex + 1
      const fileToLoad = fileList[newIndex].name

      console.log(fileToLoad)
      await deleteFile(fileHandle.name)

      const newText = await getFileText(fileToLoad)
      if (newText === undefined) return
      setCurrentFile(fileToLoad)
    },
    rename: async () => {
      setRenaming(true)
    }
  }

  const handleItemClick = ({ id }: ItemParams<ItemProps>) => {
    const handlerFunc = handlerMap[id as string]
    if (handlerFunc) handlerFunc()
  }

  // handle rename of file
  const handleRenameEnter = (newName: string) => {
    renameFile(fileHandle.name, newName).then((success) => {
      if (!success) return
      console.log('rename successful')
      setCurrentFile(newName)
      setRenaming(false)
    })
  }

  const fileItemClass = cx(styles.fileItem, currentFile === fileHandle.name && styles.activeFile)

  return (
    <>
      {renaming && (
        <Suspense fallback={null}>
          <NewFileInput
            handleBlur={() => setRenaming(false)}
            handleEnter={handleRenameEnter}
            startingName={fileHandle.name}
          />
        </Suspense>
      )}
      {!renaming && (
        <div onClick={openFile} className={fileItemClass} onContextMenu={handleContextMenu}>
          {!renaming && fileHandle.name && <span>{fileHandle.name}</span>}
          <Portal>
            <Menu id={fileHandle.name} className={styles.fileContextMenu} animation={false}>
              <Item id='rename' onClick={handleItemClick}>
                Rename File
              </Item>
              <Item id='download' onClick={handleItemClick} disabled>
                Download File
              </Item>
              <Separator />
              <Item id='delete' onClick={handleItemClick} disabled={fileList.length === 1}>
                Delete File
              </Item>
            </Menu>
          </Portal>
        </div>
      )}
    </>
  )
}
