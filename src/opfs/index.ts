import { splitPath } from '@/helpers/common'
import { useRootStore } from '@/hooks/useFileSystem'

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

/**
 * generalized to create either a folder or file at specified path
 * @param path path to item
 * @param type what type of item to create
 * @param rec should we create directories to item as needed
 * @param update whether to update global state on completion
 * @returns {Promise<boolean>} success value
 */
export async function createItemByPath(
  path: string,
  type: 'file' | 'folder',
  rec: boolean = false,
  update: boolean = true
) {
  const { createTree } = useRootStore.getState()

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
}

/**
 * creates folder at specified path
 * @param path path to new folder
 * @param rec whether to create folders recursively
 * @param update whether to update global tree state on completion
 * @returns {Promise<boolean>} success value
 */
export async function createFolderByPath(
  path: string,
  rec: boolean = true,
  update: boolean = true
) {
  return createItemByPath(path, 'folder', rec, update)
}

/**
 * write text data to specified file path
 * @param path path to create file at
 * @param rec whether to create directories recursively
 * @param update whether to update global tree state on completion
 * @returns {Promise<boolean>} success value
 */
export async function createFileByPath(path: string, rec: boolean = false, update: boolean = true) {
  return createItemByPath(path, 'file', rec, update)
}

/**
 * grabs directory for specified path
 * @param path directory path as array to get handle for
 * @param rec whether to create directories recursively
 * @returns {Promise<FileSystemDirectoryHandle | undefined>} handle to specified folder or nothing if it doesn't exist
 */
export async function getDirHandleByPath(path: string[] | string, rec: boolean = false) {
  const opfsRoot = useRootStore.getState().opfsRoot
  let pathArr = path
  if (!Array.isArray(pathArr)) pathArr = splitPath(pathArr)

  let dirHandle = opfsRoot
  for await (const name of pathArr) {
    if (!dirHandle) return undefined
    dirHandle = await dirHandle?.getDirectoryHandle(name, { create: rec })
  }

  return dirHandle
}

/**
 * create file at specified path
 * @param path path to get file handle at
 * @returns {Promise<FileSystemFileHandle | undefined>} file handle at specified path of nothing if it doesn't exist
 */
export async function getFileByPath(path: string) {
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
}

/**
 * grabs text of input file path
 * @param path path of file to get text for
 * @returns {Promise<string | undefined>} text from file
 */
export async function getFileTextByPath(path: string) {
  const fileHandle = await getFileByPath(path)
  if (!fileHandle) return undefined

  const file = await fileHandle.getFile()
  const text = await file?.text()
  return text
}

/**
 * writes text to existing file path
 * @param path path of file to write to
 * @param data text data to write to file
 * @returns {Promise<boolean>} success value
 */
export async function writeToFileByPath(path: string, data: string) {
  const filePath = splitPath(path)
  const fileName = filePath.pop()

  if (!fileName) return false

  const fileHandle = await getFileByPath(path)
  if (!fileHandle) return false

  const ws = await fileHandle.createWritable()
  await ws.write(data)
  await ws.close()
  return true
}

/**
 * get file handle for specified path
 * @param path path of file to be deleted
 * @param update whether to update global tree state on completion
 * @returns {Promise<boolean>} success value
 */
export async function deleteItemByPath(path: string, update: boolean = true) {
  const { createTree } = useRootStore.getState()

  const filePath = splitPath(path)
  const entryName = filePath.pop()
  if (!entryName) return false

  const dirHandle = await getDirHandleByPath(filePath)
  if (!dirHandle) return false

  await dirHandle.removeEntry(entryName, { recursive: true })
  if (update) await createTree()

  return true
}

/**
 * move file to new path
 * @param op original path of file
 * @param np new path of file
 * @param r whether to recursively create new path
 * @param d whether to delete old file
 * @returns {Promise<boolean>} success value
 */
export async function moveFile(
  oldPath: string,
  newPath: string,
  rec: boolean = false,
  del: boolean = true
) {
  const { createTree } = useRootStore.getState()

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
}

/**
 * move folder to new path, retain children's structure within it
 * @param oldPath original path of folder
 * @param newPath new path of folder
 * @param rec whether to recursively create new path
 * @param del whether to delete old folder
 * @returns {Promise<boolean>} success value
 */
export async function moveFolder(
  oldPath: string,
  newPath: string,
  rec: boolean = true,
  del: boolean = true
) {
  const { fileTreeObject, createTree } = useRootStore.getState()
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
}

/**
 * determines if path already exist in structure
 * @param path path of interest
 * @param isFile is path a file
 * @returns {boolean} indicates path existence
 */
export async function doesExist(path: string, _isFile: boolean = true) {
  const { fileTreeObject } = useRootStore.getState()

  const pathArr = splitPath(path)
  const finalItem = pathArr.pop() || ''
  let startingPoint = fileTreeObject
  for (const item of pathArr) {
    if (!startingPoint) return false
    startingPoint = (startingPoint[item] as FolderObject)?.children || {}
  }

  return !!startingPoint[finalItem]
}

/**
 * determines if path already exist in structure without need for global state
 * @param path path to item of interests
 * @returns {Promise<boolean>} indicates item existence
 */
export async function doesExistStateless(path: string) {
  const itemPath = splitPath(path)
  const itemName = itemPath.pop()

  const dirHandle = await getDirHandleByPath(itemPath)
  if (!dirHandle) return false

  for await (const [name] of dirHandle) {
    if (name === itemName) return true
  }

  return false
}
