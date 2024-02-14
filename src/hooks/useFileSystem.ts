import { useEffect, useState } from 'react'
import { useMount } from 'react-use'
import { create } from 'zustand'
import { splitPath } from '@/helpers/common'

navigator.storage.getDirectory()

type FileItem = { name: string; type: 'file'; fullPath: string }
type FolderItem = { name: string; type: 'folder'; fullPath: string; children: Tree }
export type Tree = (FileItem | FolderItem)[]

type FolderObject = Omit<FolderItem, 'children'> & { children: TreeTest }
type TreeTest = Record<string, FileItem | FolderObject>

export interface RootState {
  opfsRoot: FileSystemDirectoryHandle | undefined
  fileTree: Tree
  fileTreeObject: TreeTest
  fileListTest: string[]
  folderListTest: string[]
}

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
   * @param d whether to delete old file
   * @returns {Promise<boolean>} success value
   */
  moveFile: (op: string, np: string, r?: boolean, d?: boolean) => Promise<boolean>
  /**
   * move folder to new path, retain children's structure within it
   * @param op original path of folder
   * @param np new path of folder
   * @param r whether to recursively create new path
   * @param d whether to delete old folder
   * @returns {Promise<boolean>} success value
   */
  moveFolder: (op: string, np: string, r?: boolean, d?: boolean) => Promise<boolean>
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
  fileTreeObject: {},
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
      tree: Tree = [],
      treeTest: TreeTest = {}
    ) => {
      for await (const [name, handle] of directoryHandle) {
        if (handle.kind === 'file') {
          const cp = [currentPath, name].join('/')
          const fileItem: FileItem = { name, type: 'file', fullPath: cp }
          files.splice(0, 0, cp)
          tree.splice(0, 0, fileItem)
          treeTest[name] = fileItem
        } else {
          const cp = [currentPath, name].join('/')
          const nestedTree: FolderItem = { name, type: 'folder', children: [], fullPath: cp }
          const testNest: FolderObject = { name, type: 'folder', fullPath: cp, children: {} }
          treeTest[name] = testNest
          tree.splice(0, 0, nestedTree)
          folders.splice(0, 0, cp)
          await generateTree(handle, files, folders, cp, nestedTree.children, testNest.children)
        }
      }
      return [files, folders, tree, treeTest] as [string[], string[], Tree, TreeTest]
    }

    const [files, folders, tree, treeObject] = await generateTree(opfsRoot)
    tree.sort((a) => (a.type === 'folder' ? -1 : 0))

    set({
      fileTree: tree,
      fileTreeObject: treeObject,
      fileListTest: files,
      folderListTest: folders
    })
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
  moveFile: async (oldPath: string, newPath: string, rec: boolean = false, del: boolean = true) => {
    const { createTree, deleteItemByPath, getFileTextByPath, createFileByPath, writeToFileByPath } =
      get()

    try {
      const fileText = await getFileTextByPath(oldPath)
      if (fileText === undefined) {
        console.log('could not get current file text')
        return false
      }

      const created = await createFileByPath(newPath, rec, false)
      if (!created) {
        console.log('could not create new file')
        return false
      }

      const writeSuccess = await writeToFileByPath(newPath, fileText)
      if (!writeSuccess) return false
      if (del) await deleteItemByPath(oldPath, false)

      await createTree()
      return true
    } catch {
      console.error('could not move file!')
      return false
    }
  },
  moveFolder: async (
    oldPath: string,
    newPath: string,
    rec: boolean = true,
    del: boolean = true
  ) => {
    const { fileTreeObject, createTree, moveFile, deleteItemByPath } = get()
    const splitOldPath = splitPath(oldPath)

    // lets generate a list of paths we'll need to move
    let startingPoint = fileTreeObject
    for (const item of splitOldPath) {
      startingPoint = (startingPoint[item] as FolderObject).children
    }

    // create a list of files that exist in a folder
    const generateChildrenList = (tree: TreeTest, pathList: string[] = []) => {
      for (const item of Object.values(tree)) {
        const { type, fullPath } = item
        if (type === 'file') {
          pathList.splice(0, 0, fullPath)
        } else {
          generateChildrenList(item.children, pathList)
        }
      }
      return pathList
    }

    // get all original paths, and create new paths
    const originalChildrenPaths = generateChildrenList(startingPoint)
    const newChildrenPaths = originalChildrenPaths.map((i) => {
      const s = splitPath(i)
      return [...splitPath(newPath), ...s.slice(splitOldPath.length)].join('/')
    })

    // copy all new files to their new locations
    let moveSuccess = true
    for await (const [i, p] of newChildrenPaths.entries()) {
      moveSuccess = await moveFile(originalChildrenPaths[i], p, rec, false)
      if (!moveSuccess) return false
    }

    if (del) await deleteItemByPath(oldPath, false)

    await createTree()
    return true
  },
  doesExist: (path: string, _isFile: boolean = true) => {
    const { fileTreeObject } = get()

    const pathArr = splitPath(path)
    const finalItem = pathArr.pop() || ''
    let startingPoint = fileTreeObject
    for (const item of pathArr) {
      if (!startingPoint) return false
      startingPoint = (startingPoint[item] as FolderObject)?.children || {}
    }

    return !!startingPoint[finalItem]
  }
}))

export default function useFileSystem() {
  const { opfsRoot, initalizeRoot: initRoot, createTree, ...rest } = useRootStore()
  const [isAvailable, setIsAvailable] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useMount(() => {
    if (navigator.storage) setIsAvailable(true)
  })

  useEffect(() => {
    if (!isAvailable) return
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
  }, [isAvailable])

  return { isReady, createTree, ...rest }
}
