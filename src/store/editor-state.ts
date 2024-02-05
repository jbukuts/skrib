import { create } from 'zustand'

export interface EditorState {
  showPreview: boolean
  showSettings: boolean
  scrollPosition: number
  fileView: boolean
}

interface EditorMutate {
  togglePreview: () => void
  toggleSettings: () => void
  setScrollPos: (_n: number) => void
  setArbitrary: (_s: Partial<EditorState>) => void
  toggleFileView: () => void
}

export const DEF_SETTINGS: EditorState = {
  showPreview: false,
  showSettings: false,
  scrollPosition: 0,
  fileView: false
}

const useEditorStateStore = create<EditorState & EditorMutate>((set) => ({
  ...DEF_SETTINGS,
  togglePreview: () => set((s) => ({ showPreview: !s.showPreview })),
  toggleSettings: () => set((s) => ({ showSettings: !s.showSettings })),
  setScrollPos: (n) => set({ scrollPosition: n }),
  setArbitrary: (s) => set(s),
  toggleFileView: () => set((s) => ({ fileView: !s.fileView }))
}))

export default useEditorStateStore
