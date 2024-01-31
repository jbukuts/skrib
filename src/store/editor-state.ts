import { create } from 'zustand'

export interface EditorState {
  showPreview: boolean
  showSettings: boolean
  scrollPosition: number
}

interface EditorMutate {
  togglePreview: () => void
  toggleSettings: () => void
  setScrollPos: (_n: number) => void
  setArbitrary: (_s: Partial<EditorState>) => void
}

export const DEF_SETTINGS: EditorState = {
  showPreview: false,
  showSettings: false,
  scrollPosition: 0
}

const useEditorStateStore = create<EditorState & EditorMutate>((set) => ({
  ...DEF_SETTINGS,
  togglePreview: () => set((s) => ({ showPreview: !s.showPreview })),
  toggleSettings: () => set((s) => ({ showSettings: !s.showSettings })),
  setScrollPos: (n) => set({ scrollPosition: n }),
  setArbitrary: (s) => set(s)
}))

export default useEditorStateStore
