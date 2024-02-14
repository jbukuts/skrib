import { useLocalStorage } from '@uidotdev/usehooks'
import cx from 'classnames'
import { Suspense, lazy, useState } from 'react'
import { Item, ItemParams, ItemProps, Separator, useContextMenu } from 'react-contexify'
import { VscFile } from 'react-icons/vsc'
import { Stack } from '@/components/UI/Layout'
import { LOCAL_STORAGE_MAP } from '@/constants'
import { useFileSystem } from '@/hooks'
import FileContextMenu from '../FileContextMenu'
import styles from '../SharedItem.module.scss'
import 'react-contexify/ReactContexify.css'

const NewFileInput = lazy(() => import('../NewFileInput'))

const { currentFile: currentFileKey, localText: localTextKey } = LOCAL_STORAGE_MAP

interface FileItemProps {
  fileName: string
  path: string
  rename?: boolean
}

export default function FileItem(props: FileItemProps) {
  const { fileName = '', path } = props
  const [renaming, setRenaming] = useState<boolean>(false)
  const [currentFilePath, setCurrentFilePath] = useLocalStorage<string>(currentFileKey)
  const { show } = useContextMenu({
    id: fileName
  })

  // file handlers
  const { deleteItemByPath, moveFile, writeToFileByPath, doesExist } = useFileSystem()

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
    if (path == currentFilePath) return
    if (!currentFilePath || !doesExist(currentFilePath)) {
      setCurrentFilePath(path)
      return
    }

    const text = JSON.parse(localStorage.getItem(localTextKey) || '')
    writeToFileByPath(currentFilePath, text).then((success) => {
      if (success) setCurrentFilePath(path)
    })
  }

  // various funcs for context menu
  const handlerMap: Record<string, () => void> = {
    delete: async () => {
      // delete file
      const deleteSuccess = await deleteItemByPath(path)
      if (!deleteSuccess) return
      setCurrentFilePath('')
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
    // create path from new name
    const pathSplit = path.split('/')
    pathSplit[pathSplit.length - 1] = `${newName}.md`
    const newPath = pathSplit.join('/')

    moveFile(path, newPath).then((success) => {
      if (!success) {
        setCurrentFilePath('')
        setRenaming(false)
        return
      }
      console.log('rename successful')
      setCurrentFilePath(newPath)
      setRenaming(false)
    })
  }

  const isCurrentFile = currentFilePath === path
  const fileItemClass = cx(styles.item, isCurrentFile && styles.activeItem)

  return (
    <>
      {renaming && (
        <Suspense fallback={null}>
          <NewFileInput
            fromPath={path.split('/').slice(0, -1).join('/')}
            handleBlur={() => setRenaming(false)}
            handleEnter={handleRenameEnter}
            startingName={fileName.slice(0, -3)}
          />
        </Suspense>
      )}
      {!renaming && (
        <div onClick={openFile} className={fileItemClass} onContextMenu={handleContextMenu}>
          {!renaming && fileName && (
            <Stack dir='horizontal' spacing='sm' style={{ alignItems: 'center' }}>
              <VscFile className={cx(styles.itemIcon, isCurrentFile && styles.activeIcon)} />
              <span>{fileName}</span>
            </Stack>
          )}
          <FileContextMenu id={fileName}>
            <Item id='rename' onClick={handleItemClick}>
              Rename File
            </Item>
            <Item id='download' onClick={handleItemClick} disabled>
              Download File
            </Item>
            <Separator />
            <Item id='delete' onClick={handleItemClick}>
              Delete File
            </Item>
          </FileContextMenu>
        </div>
      )}
    </>
  )
}
