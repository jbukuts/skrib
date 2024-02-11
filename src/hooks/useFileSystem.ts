import { useState } from 'react'
import { useMount } from 'react-use'
import { create } from 'zustand'

navigator.storage.getDirectory()

type FileItem = { name: string; type: 'file'; fullPath: string }
type FolderItem = { name: string; type: 'folder'; fullPath: string; children: Tree }
export type Tree = (FileItem | FolderItem)[]

export interface RootState {
  opfsRoot: FileSystemDirectoryHandle | undefined
  fileTree: Tree
  fileListTest: string[]
  folderListTest: string[]
}

const splitPath = (p: string) => p.split('/').filter((i) => !!i)

interface RootMutate {
  /**
   * initializes OPFS root into global state
   * @returns {Promise<void>}
   */
  initalizeRoot: () => Promise<void>
  /**
   * generates tree structures and sets it in global state
   * @returns {Promise<void>}
   */
  createTree: () => Promise<void>
  /**
   * grabs directory for specified path
   * @param p directory path as array to get handle for
   * @param r whether to create directories recursively
   * @returns {Promise<FileSystemDirectoryHandle | undefined>} handle to specified folder or nothing if it doesn't exist
   */
  getDirHandleByPath: (
    p: string[] | string,
    r?: boolean
  ) => Promise<FileSystemDirectoryHandle | undefined>
  /**
   * grabs text of input file path
   * @param p path of file to get text for
   * @returns {Promise<string | undefined>} text from file
   */
  getFileTextByPath: (p: string) => Promise<string | undefined>
  /**
   * writes text to existing file path
   * @param p path of file to write to
   * @param d text data to write to file
   * @returns {Promise<boolean>} success value
   */
  writeToFileByPath: (p: string, d: string) => Promise<boolean>
  createItemByPath: (p: string, i: 'folder' | 'file', r?: boolean, u?: boolean) => Promise<boolean>
  /**
   * write text data to specified file path
   * @param p path to create file at
   * @param r whether to create directories recursively
   * @param u whether to update global tree state on completion
   * @returns {Promise<boolean>} success value
   */
  createFileByPath: (p: string, r?: boolean, u?: boolean) => Promise<boolean>
  /**
   * creates folder at specified path
   * @param p path to new folder
   * @param r whether to create folders recursively
   * @param u whether to update global tree state on completion
   * @returns {Promise<boolean>} success value
   */
  createFolderByPath: (p: string, r?: boolean, u?: boolean) => Promise<boolean>
  /**
   * create file at specified path
   * @param p path to get file handle at
   * @returns {Promise<FileSystemFileHandle | undefined>} file handle at specified path of nothing if it doesn't exist
   */
  getFileByPath: (p: string) => Promise<FileSystemFileHandle | undefined>
  /**
   * get file handle for specified path
   * @param p path of file to be deleted
   * @param u whether to update global tree state on completion
   * @returns {Promise<boolean>} success value
   */
  deleteItemByPath: (p: string, u?: boolean) => Promise<boolean>
  /**
   * move file to new path
   * @param op original path of file
   * @param np new path of file
   * @param r whether to recursively create new path
   * @returns {Promise<boolean>} success value
   */
  moveFile: (op: string, np: string, r?: boolean) => Promise<boolean>
  /**
   * determines if path already exist in structure
   * @param p path of interest
   * @param is is path a file
   * @returns {boolean} indicates path existence
   */
  doesExist: (p: string, is?: boolean) => boolean
}

const useRootStore = create<RootState & RootMutate>((set, get) => ({
  opfsRoot: undefined,
  folderListTest: [],
  fileListTest: [],
  fileTree: [],
  initalizeRoot: async () => {
    const root = await navigator.storage.getDirectory()
    set({ opfsRoot: root })
  },
  createTree: async () => {
    const opfsRoot = get().opfsRoot
    if (!opfsRoot) return

    const generateTree = async (
      directoryHandle: FileSystemDirectoryHandle,
      files: string[] = [],
      folders: string[] = [],
      currentPath: string = '',
      tree: Tree = []
    ) => {
      for await (const [name, handle] of directoryHandle) {
        if (handle.kind === 'file') {
          const cp = [currentPath, name].join('/')
          files.splice(0, 0, cp)
          tree.splice(0, 0, { name, type: 'file', fullPath: cp })
        } else {
          const cp = [currentPath, name].join('/')
          const nestedTree: FolderItem = { name, type: 'folder', children: [], fullPath: cp }
          tree.splice(0, 0, nestedTree)
          folders.splice(0, 0, cp)
          await generateTree(handle, files, folders, cp, nestedTree.children)
        }
      }

      return [files, folders, tree] as [string[], string[], Tree]
    }

    const [files, folders, tree] = await generateTree(opfsRoot)

    tree.sort((a) => (a.type === 'folder' ? -1 : 0))
    // tree.sort((a, b) => a.name.localeCompare(b.name))

    // console.log(files)
    // console.log(folders)
    console.log(tree)
    set({ fileTree: tree, fileListTest: files, folderListTest: folders })
  },
  getFileTextByPath: async (path: string) => {
    const { opfsRoot } = get()

    const pathSplit = path.split('/').filter((i) => !!i)
    const fileName = pathSplit.pop() as string

    let dirHandle = opfsRoot
    for await (const name of pathSplit) {
      if (!dirHandle) return undefined
      dirHandle = await dirHandle?.getDirectoryHandle(name, { create: false })
    }

    const fileHande = await dirHandle?.getFileHandle(fileName, { create: false })
    const file = await fileHande?.getFile()
    const text = await file?.text()
    return text
  },
  getDirHandleByPath: async (path: string[] | string, rec: boolean = false) => {
    const { opfsRoot } = get()

    let pathArr = path
    if (!Array.isArray(pathArr)) pathArr = splitPath(pathArr)

    let dirHandle = opfsRoot
    for await (const name of pathArr) {
      if (!dirHandle) return undefined
      dirHandle = await dirHandle?.getDirectoryHandle(name, { create: rec })
    }

    return dirHandle
  },
  createItemByPath: async (
    path: string,
    type: 'file' | 'folder',
    rec: boolean = false,
    update: boolean = true
  ) => {
    const { getDirHandleByPath, createTree } = get()

    const itemPath = splitPath(path)
    const itemName = itemPath.pop()
    if (!itemName) return false

    try {
      const dirHandle = await getDirHandleByPath(itemPath, rec)
      if (!dirHandle) return false

      const createMethod = type === 'file' ? 'getFileHandle' : 'getDirectoryHandle'
      console.info('creating', itemName, 'at', itemPath, 'of', type, 'with', createMethod)
      await dirHandle[createMethod](itemName, { create: true })

      if (update) await createTree()
      return true
    } catch (e: unknown) {
      console.error(e)
      return false
    }
  },
  createFolderByPath: async (path: string, rec: boolean = true, update: boolean = true) => {
    const { createItemByPath } = get()
    return createItemByPath(path, 'folder', rec, update)
  },
  createFileByPath: async (path: string, rec: boolean = false, update: boolean = true) => {
    const { createItemByPath } = get()
    return createItemByPath(path, 'file', rec, update)
  },
  getFileByPath: async (path: string) => {
    const { getDirHandleByPath } = get()

    try {
      const filePath = splitPath(path)
      const fileName = filePath.pop()

      if (!fileName) return undefined

      const dirHandle = await getDirHandleByPath(filePath)
      if (!dirHandle) return undefined

      const fileHandle = await dirHandle.getFileHandle(fileName, { create: false })
      return fileHandle
    } catch (e: unknown) {
      console.error('Error getting file from path', path)
      console.error(e)
      return undefined
    }
  },
  writeToFileByPath: async (path: string, data: string) => {
    const { getDirHandleByPath } = get()

    const filePath = splitPath(path)
    const fileName = filePath.pop()

    if (!fileName) return false
    const dirHandle = await getDirHandleByPath(filePath)

    if (!dirHandle) return false

    const fileHandle = await dirHandle.getFileHandle(fileName, { create: false })
    const ws = await fileHandle.createWritable()
    await ws.write(data)
    await ws.close()
    // await createTree()
    return true
  },
  deleteItemByPath: async (path: string, update: boolean = true) => {
    const { getDirHandleByPath, createTree } = get()

    const filePath = splitPath(path)
    const entryName = filePath.pop()
    if (!entryName) return false

    const dirHandle = await getDirHandleByPath(filePath)
    if (!dirHandle) return false

    await dirHandle.removeEntry(entryName, { recursive: true })
    if (update) await createTree()

    return true
  },
  moveFile: async (oldPath: string, newPath: string, rec: boolean = false) => {
    const { createTree, deleteItemByPath, getFileTextByPath, createFileByPath, writeToFileByPath } =
      get()

    try {
      const fileText = await getFileTextByPath(oldPath)
      // console.log(fileText)
      if (fileText === undefined) {
        console.log('could not get current file text')
        return false
      }

      const created = await createFileByPath(newPath, rec, false)
      console.log('created file!!!!!!', created)
      if (!created) {
        console.log('could not create new file')
        return false
      }

      const promises = await Promise.all([
        writeToFileByPath(newPath, fileText),
        deleteItemByPath(oldPath, false)
      ])

      if (!promises.every((v) => v === true)) return false

      await createTree()
      return true
    } catch {
      console.error('could not move file!')
      return false
    }
  },
  doesExist: (path: string, isFile: boolean = true) => {
    const { fileListTest, folderListTest } = get()
    const listOfInterest = isFile ? fileListTest : folderListTest
    return listOfInterest.indexOf(path) > -1
  }
}))

export default function useFileSystem() {
  const { opfsRoot, initalizeRoot: initRoot, createTree, ...rest } = useRootStore()
  const [isReady, setIsReady] = useState(false)

  useMount(() => {
    if (opfsRoot) {
      setIsReady(true)
      return
    }

    const init = async () => {
      console.log('Initing OPFS root and tree!')
      await initRoot()
      await createTree()
      setIsReady(true)
    }

    init()
  })

  return { isReady, createTree, ...rest }
}
