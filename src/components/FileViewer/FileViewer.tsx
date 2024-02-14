import { useLocalStorage } from '@uidotdev/usehooks'
import { useState } from 'react'
import { VscNewFile, VscNewFolder, VscRefresh } from 'react-icons/vsc'
import { Resizable, ResizeCallbackData } from 'react-resizable'
import { LOCAL_STORAGE_MAP } from '@/constants'
import { useFileSystem } from '@/hooks'
import { Tree } from '@/hooks/useFileSystem'
import { IconButton } from '../UI'
import { Stack } from '../UI/Layout'
import FileItem from './FileItem'
import styles from './FileViewer.module.scss'
import FolderItem from './FolderItem'
import NewFileInput from './NewFileInput'

const { currentFile: currentFileKey } = LOCAL_STORAGE_MAP

interface FileTreeProps {
  tree: Tree
  depth?: number
}

function FileTree(props: FileTreeProps) {
  const { tree, depth = 0 } = props

  return (
    <>
      {tree.map((item) => {
        const { name, type, fullPath } = item
        const isFolder = type == 'folder'

        if (!isFolder) return <FileItem path={fullPath} key={name} fileName={name} />

        return (
          <FolderItem key={name} name={name} path={fullPath}>
            <FileTree tree={item.children} depth={depth + 1}></FileTree>
          </FolderItem>
        )
      })}
    </>
  )
}

export default function FileViewer() {
  const [size, setSize] = useState<ResizeCallbackData['size']>({ width: 250, height: Infinity })
  const [creatingItem, setCreatingItem] = useState<undefined | 'folder' | 'file'>(undefined)
  const { fileTree, createFileByPath, createFolderByPath, createTree } = useFileSystem()
  const [_, setCurrentFilePath] = useLocalStorage(currentFileKey)

  const createMap: Record<
    'folder' | 'file',
    (p: string, r?: boolean, u?: boolean) => Promise<boolean>
  > = {
    folder: createFolderByPath,
    file: createFileByPath
  }

  // On top layout
  const onResize = (_event: unknown, { size }: ResizeCallbackData) => {
    setSize({ width: size.width, height: size.height })
  }

  const handleCreateEnter = async (newName: string) => {
    if (!creatingItem) return
    if (creatingItem === 'file') newName = `${newName}.md`

    const newPath = '/' + newName
    const createFunc = createMap[creatingItem]
    createFunc(newPath).then((success) => {
      if (success && creatingItem === 'file') setCurrentFilePath(newPath)
    })
  }

  return (
    <Resizable
      axis='x'
      width={size.width}
      onResize={onResize}
      handle={<div className={styles.handle}></div>}>
      <Stack
        onContextMenu={(e) => {
          e.preventDefault()
        }}
        dir='vertical'
        className={styles.fileViewer}
        style={{
          width: `${size.width}px`
        }}>
        <Stack dir='vertical' spacing='none'>
          <FileTree tree={fileTree}></FileTree>
          {creatingItem && (
            <NewFileInput
              adornment={creatingItem === 'file' ? VscNewFile : VscNewFolder}
              type={creatingItem}
              handleEnter={handleCreateEnter}
              handleBlur={() => setCreatingItem(undefined)}
            />
          )}
        </Stack>
        <Stack className={styles.fileViewMenu} spacing='xs' reverse>
          <IconButton
            title='Create new file'
            size={18}
            icon={VscNewFile}
            onClick={() => setCreatingItem('file')}
          />
          <IconButton
            title='Create new file'
            size={18}
            icon={VscNewFolder}
            onClick={() => setCreatingItem('folder')}
          />
          <IconButton
            icon={VscRefresh}
            size={18}
            title='Refresh explorer'
            onClick={() => createTree()}
          />
        </Stack>
      </Stack>
    </Resizable>
  )
}
