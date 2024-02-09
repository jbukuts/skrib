import { useLocalStorage } from '@uidotdev/usehooks'
import cx from 'classnames'
import { Suspense, lazy, useState } from 'react'
import { Item, ItemParams, ItemProps, Menu, Separator, useContextMenu } from 'react-contexify'
import { createPortal } from 'react-dom'
import { LOCAL_STORAGE_MAP } from '@/constants'
import { useCurrentFile, useFileSystem, useNamedFile } from '@/hooks'
import styles from './FileItem.module.scss'
import 'react-contexify/ReactContexify.css'

const NewFileInput = lazy(() => import('../NewFileInput'))

const { currentFile: currentFileKey } = LOCAL_STORAGE_MAP

interface FileItemProps {
  fileName: string
  rename?: boolean
}

function Portal({ children }: { children: React.ReactNode }) {
  return createPortal(children, document.body)
}

export default function FileItem(props: FileItemProps) {
  const { fileName = '' } = props
  const [renaming, setRenaming] = useState<boolean>(false)
  const [_, setCurrentFile] = useLocalStorage<string>(currentFileKey)
  const { show } = useContextMenu({
    id: fileName
  })

  // file handlers
  const { fileList, indexOfFile } = useFileSystem()
  const { currentFileName, saveCurrentFile } = useCurrentFile()
  const { doesExist, deleteFile, renameFile } = useNamedFile(fileName)

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
    if (fileName == currentFileName) return
    saveCurrentFile().then((success) => {
      if (success) setCurrentFile(fileName)
    })
  }

  // various funcs for context menu
  const handlerMap: Record<string, () => void> = {
    delete: async () => {
      if (!doesExist || fileList.length === 1) return
      const currentIndex = indexOfFile(fileName)
      const shiftIndex = currentIndex === fileList.length - 1 ? -1 : 1
      const fileToLoad = fileList[currentIndex + shiftIndex].name

      // delete file
      const deleteSuccess = await deleteFile()
      if (!deleteSuccess) return
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
    renameFile(newName).then((success) => {
      if (!success) return
      console.log('rename successful')
      setCurrentFile(newName)
      setRenaming(false)
    })
  }

  const fileItemClass = cx(styles.fileItem, currentFileName === fileName && styles.activeFile)

  return (
    <>
      {renaming && (
        <Suspense fallback={null}>
          <NewFileInput
            handleBlur={() => setRenaming(false)}
            handleEnter={handleRenameEnter}
            startingName={fileName}
          />
        </Suspense>
      )}
      {!renaming && (
        <div onClick={openFile} className={fileItemClass} onContextMenu={handleContextMenu}>
          {!renaming && fileName && <span>{fileName}</span>}
          <Portal>
            <Menu id={fileName} className={styles.fileContextMenu} animation={false}>
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
