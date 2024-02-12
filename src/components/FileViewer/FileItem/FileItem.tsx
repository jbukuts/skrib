import { useLocalStorage } from '@uidotdev/usehooks'
import cx from 'classnames'
import { Suspense, lazy, useState } from 'react'
import { Item, ItemParams, ItemProps, Separator, useContextMenu } from 'react-contexify'
import { VscFile } from 'react-icons/vsc'
import { Stack } from '@/components/UI/Layout'
import { LOCAL_STORAGE_MAP } from '@/constants'
import { useCurrentFile, useNamedFile } from '@/hooks'
import FileContextMenu from '../FileContextMenu'
import styles from './FileItem.module.scss'
import 'react-contexify/ReactContexify.css'

const NewFileInput = lazy(() => import('../NewFileInput'))

const { currentFile: currentFileKey } = LOCAL_STORAGE_MAP

interface FileItemProps {
  fileName: string
  path: string
  rename?: boolean
  depth?: number
}

export default function FileItem(props: FileItemProps) {
  const { fileName = '', path, depth = 0 } = props
  const [renaming, setRenaming] = useState<boolean>(false)
  const [_, setCurrentFile] = useLocalStorage<string>(currentFileKey)
  const { show } = useContextMenu({
    id: fileName
  })

  // file handlers
  const { currentFileName, saveCurrentFile, doesExist: doesCurrentExist } = useCurrentFile()
  const { deleteFile, moveFile } = useNamedFile(path)

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
    if (path == currentFileName) return
    if (!currentFileName || !doesCurrentExist) {
      setCurrentFile(path)
      return
    }

    saveCurrentFile().then((success) => {
      if (success) setCurrentFile(path)
    })
  }

  // various funcs for context menu
  const handlerMap: Record<string, () => void> = {
    delete: async () => {
      // delete file
      const deleteSuccess = await deleteFile()
      if (!deleteSuccess) return
      setCurrentFile('')
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

    moveFile(newPath).then((success) => {
      if (!success) {
        setCurrentFile('')
        setRenaming(false)
        return
      }
      console.log('rename successful')
      setCurrentFile(newPath)
      setRenaming(false)
    })
  }

  const fileItemClass = cx(styles.fileItem, currentFileName === path && styles.activeFile)

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
            <Stack
              dir='horizontal'
              spacing='sm'
              style={{ alignItems: 'center', paddingLeft: `${depth}rem` }}>
              <VscFile></VscFile>
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
