import { useLocalStorage } from '@uidotdev/usehooks'
import cx from 'classnames'
import { createElement, useState } from 'react'
import { Item, ItemParams, ItemProps, Separator, useContextMenu } from 'react-contexify'
import { VscFolder, VscFolderOpened, VscNewFile, VscNewFolder } from 'react-icons/vsc'
import { Stack } from '@/components/UI/Layout'
import { LOCAL_STORAGE_MAP } from '@/constants'
import { splitPath } from '@/helpers/common'
import { useFileSystem } from '@/hooks'
import FileContextMenu from '../FileContextMenu'
import NewFileInput from '../NewFileInput'
import styles from '../SharedItem.module.scss'
import folderStyles from './FolderItem.module.scss'

const { currentFile: currentFileKey } = LOCAL_STORAGE_MAP

interface FolderItemProps {
  path: string
  name: string
  children: React.ReactNode
}

export default function FolderItem(props: FolderItemProps) {
  const { children, name, path } = props
  const { show } = useContextMenu({
    id: path
  })
  const { createFileByPath, createFolderByPath, deleteItemByPath, moveFolder } = useFileSystem()
  const [creatingItem, setCreatingItem] = useState<'file' | 'folder' | undefined>(undefined)
  const [renaming, setRenaming] = useState<boolean>(false)
  const [currentFilePath, setCurrentFilePath] = useLocalStorage<string>(currentFileKey)
  const [showChildren, setShowChildren] = useState<boolean>(true)

  const handleContextMenu = (event: React.MouseEvent) => {
    show({
      event,
      props: {
        key: 'value'
      }
    })
  }

  // various funcs for context menu
  const handlerMap: Record<string, () => void> = {
    'create-file': () => {
      setShowChildren(true)
      setCreatingItem('file')
    },
    'create-folder': () => {
      setShowChildren(true)
      setCreatingItem('folder')
    },
    'rename-folder': () => {
      setRenaming(true)
    },
    delete: () => {
      // TODO: change active file if it was in folder
      deleteItemByPath(path)
    }
  }

  const handleItemClick = ({ id }: ItemParams<ItemProps>) => {
    const handlerFunc = handlerMap[id as string]
    if (handlerFunc) handlerFunc()
  }

  // EXPERIMENTAL: handle rename of folder
  const handleRenameEnter = (newName: string) => {
    const splitPathArr = splitPath(path)
    splitPathArr[splitPathArr.length - 1] = newName
    const newPath = splitPathArr.join('/')

    // determine new path of current file if current file is in renamed folder
    let currentFileNewPath = currentFilePath
    if (currentFilePath.startsWith(path)) {
      currentFileNewPath.replace(path, newPath)

      currentFileNewPath = [
        '',
        ...splitPathArr,
        ...splitPath(currentFileNewPath).slice(splitPathArr.length)
      ].join('/')
    }

    // time to move!
    moveFolder(path, newPath).then((success) => {
      console.log(`folder rename was ${success}`)
      if (!success) return
      if (currentFileNewPath !== currentFilePath) {
        console.log(currentFileNewPath)
        setCurrentFilePath(currentFileNewPath)
      }
    })
  }

  // handle creation of new folder or file
  const handleNewItemEnter = (newName: string) => {
    if (!creatingItem) return
    if (creatingItem === 'file') newName = `${newName}.md`
    const newPath = [path, newName].join('/')
    console.log('creating', newPath)

    const createFunc = creatingItem === 'file' ? createFileByPath : createFolderByPath
    createFunc(newPath)
  }

  return (
    <Stack dir='vertical' spacing='none'>
      {!renaming && (
        <Stack
          dir='horizontal'
          spacing='sm'
          className={styles.item}
          onClick={() => setShowChildren((c) => !c)}
          onContextMenu={handleContextMenu}>
          {createElement(showChildren ? VscFolderOpened : VscFolder, {
            className: cx(styles.itemIcon, showChildren && styles.activeIcon)
          })}
          {name}
        </Stack>
      )}
      {renaming && (
        <NewFileInput
          adornment={showChildren ? VscFolderOpened : VscFolder}
          startingName={name}
          handleBlur={() => setRenaming(false)}
          handleEnter={handleRenameEnter}></NewFileInput>
      )}
      <Stack
        dir='horizontal'
        style={{ display: showChildren ? '' : 'none', width: '100%' }}
        spacing='none'>
        <div className={folderStyles.folderLine} />
        <div style={{ flex: '1' }}>
          {children}
          {creatingItem && (
            <NewFileInput
              adornment={creatingItem === 'file' ? VscNewFile : VscNewFolder}
              fromPath={path}
              handleEnter={handleNewItemEnter}
              handleBlur={() => setCreatingItem(undefined)}></NewFileInput>
          )}
        </div>
      </Stack>
      <FileContextMenu id={path}>
        <Item id='create-file' onClick={handleItemClick}>
          Create New File
        </Item>
        <Item id='create-folder' onClick={handleItemClick}>
          Create New Folder
        </Item>
        <Item id='rename-folder' onClick={handleItemClick}>
          Rename Folder
        </Item>
        <Separator></Separator>
        <Item id='delete' onClick={handleItemClick}>
          Delete Folder
        </Item>
      </FileContextMenu>
    </Stack>
  )
}
