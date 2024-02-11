import { createElement, useState } from 'react'
import { Item, ItemParams, ItemProps, Menu, Separator, useContextMenu } from 'react-contexify'
import { VscFolder, VscFolderOpened } from 'react-icons/vsc'
import Portal from '@/components/Portal'

import { Stack } from '@/components/UI/Layout'
import { useFileSystem } from '@/hooks'
import menuStyles from '../FileItem/FileItem.module.scss'
import NewFileInput from '../NewFileInput'
import styles from './FolderItem.module.scss'

interface FolderItemProps {
  path: string
  name: string
  children: React.ReactNode
  depth?: number
}

export default function FolderItem(props: FolderItemProps) {
  const { children, depth = 0, name, path } = props
  const [showChildren, setShowChildren] = useState<boolean>(false)
  const { show } = useContextMenu({
    id: path
  })
  const { createFileByPath, createFolderByPath, deleteItemByPath } = useFileSystem()
  const [creatingItem, setCreatingItem] = useState<'file' | 'folder' | undefined>(undefined)

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
      setCreatingItem('file')
    },
    'create-folder': () => {
      setCreatingItem('folder')
    },
    delete: () => {
      deleteItemByPath(path)
    }
  }

  const handleItemClick = ({ id }: ItemParams<ItemProps>) => {
    const handlerFunc = handlerMap[id as string]
    if (handlerFunc) handlerFunc()
  }

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
      <Stack
        style={{ paddingLeft: `calc(0.375rem + ${depth}rem)` }}
        dir='horizontal'
        spacing='sm'
        className={styles.folderItem}
        onClick={() => setShowChildren((c) => !c)}
        onContextMenu={handleContextMenu}>
        {createElement(showChildren ? VscFolderOpened : VscFolder)}
        {name}
      </Stack>
      {showChildren && <div>{children}</div>}
      {creatingItem && (
        <NewFileInput
          fromPath={path}
          handleEnter={handleNewItemEnter}
          handleBlur={() => setCreatingItem(undefined)}></NewFileInput>
      )}
      <Portal>
        <Menu id={path} className={menuStyles.fileContextMenu} animation={false}>
          <Item id='create-file' onClick={handleItemClick}>
            Create New File
          </Item>
          <Item id='create-folder' onClick={handleItemClick}>
            Create New Folder
          </Item>
          <Separator></Separator>
          <Item id='delete' onClick={handleItemClick}>
            Delete Folder
          </Item>
        </Menu>
      </Portal>
    </Stack>
  )
}
