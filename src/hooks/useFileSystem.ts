import { useState } from 'react'
import { useMount } from 'react-use'
import { create } from 'zustand'

navigator.storage.getDirectory()

export interface RootState {
  opfsRoot: FileSystemDirectoryHandle | undefined
  fileList: (FileSystemFileHandle | FileSystemDirectoryHandle)[]
}

interface RootMutate {
  initalizeRoot: () => Promise<void>
  updateList: () => Promise<boolean>
  createFile: (n: string) => Promise<boolean>
  getFileText: (n: string) => Promise<string | undefined>
  writeToFile: (n: string, d: string) => Promise<boolean>
  deleteFile: (n: string) => Promise<boolean>
  renameFile: (n: string, o: string) => Promise<boolean>
  doesAlreadyExist: (n: string) => boolean
}

const useRootStore = create<RootState & RootMutate>((set, get) => ({
  opfsRoot: undefined,
  fileList: [],
  initalizeRoot: async () => {
    const root = await navigator.storage.getDirectory()
    set({ opfsRoot: root })
  },
  updateList: async () => {
    const root = get().opfsRoot
    if (!root) return false

    try {
      const vals = await root.values()
      const listArr = []
      for await (const i of vals) listArr.push(i)
      listArr.sort((a, b) => a.name.localeCompare(b.name))
      set({ fileList: listArr.filter((f) => !f.name.endsWith('.crswap')) })

      return true
    } catch {
      return false
    }
  },
  createFile: async (name: string) => {
    const { opfsRoot: root, fileList, updateList } = get()
    if (!root) return false

    try {
      const alreadyExists = fileList.some((f) => {
        f.name === name
      })

      if (alreadyExists) {
        console.warn(`File ${name} already exist. Exiting`)
        return false
      }

      await root.getFileHandle(name, { create: true })
      await updateList()
      return true
    } catch {
      return false
    }
  },
  getFileText: async (name: string) => {
    const { fileList } = get()
    const index = fileList.map((f) => f.name).indexOf(name)
    if (index == -1 || fileList[index].kind === 'directory') return undefined
    const file = await (fileList[index] as FileSystemFileHandle).getFile()
    const text = await file.text()
    return text
  },
  writeToFile: async (name: string, data: string) => {
    const { opfsRoot, updateList } = get()
    if (!opfsRoot) return false

    try {
      const handle = await opfsRoot.getFileHandle(name, { create: false })
      const ws = await handle.createWritable()
      await ws.write(data)
      await ws.close()
      await updateList()
      return true
    } catch {
      return false
    }
  },
  deleteFile: async (name: string) => {
    const { opfsRoot, updateList, doesAlreadyExist } = get()
    if (!opfsRoot) return false

    try {
      const alreadyExists = doesAlreadyExist(name)
      if (!alreadyExists) return false

      await opfsRoot.removeEntry(name)
      await updateList()

      return true
    } catch {
      return false
    }
  },
  renameFile: async (oldName: string, newName: string) => {
    const { opfsRoot, createFile, deleteFile, getFileText, updateList, writeToFile } = get()
    if (!opfsRoot) return false

    // get old file text
    const fileText = await getFileText(oldName)
    if (fileText === undefined) return false

    // create new file
    const created = await createFile(newName)
    if (!created) return false

    // write to new file and delete old file
    const promises = await Promise.all([
      writeToFile(newName, fileText),
      deleteFile(oldName),
      updateList()
    ])

    if (!promises.every((v) => v === true)) return false
    return true
  },
  doesAlreadyExist: (name: string) => {
    const { fileList } = get()
    return fileList.map((f) => f.name).some((n) => n === name)
  }
}))

export default function useFileSystem() {
  const { opfsRoot, initalizeRoot: initRoot, updateList, ...rest } = useRootStore()
  const [isReady, setIsReady] = useState(false)

  useMount(() => {
    if (opfsRoot) return

    const init = async () => {
      console.log('Initing opfs root and list!')
      await initRoot()
      await updateList()
      setIsReady(true)
    }

    init()
  })

  return { isReady, ...rest }
}