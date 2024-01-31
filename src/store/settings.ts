import { create } from 'zustand'
import { clamp } from '@/helpers/common'

export type FontFace =
  | 'Ubuntu'
  | 'IBM Plex Sans'
  | 'IBM Plex Serif'
  | 'IBM Plex Mono'
  | 'Open Sans'
  | 'Ubuntu Mono'
  | 'JetBrains Mono Variable'

export type Theme = 'light' | 'dark' | 'monokai'

export interface SettingsState {
  fontFace: FontFace
  fontSize: number
  lineHeight: number
  theme: Theme
  showLineCount: boolean
  showInfoPanel: boolean
  variableHeadings: boolean
}

interface SettingsMutate {
  setFontFace: (_ff: FontFace) => void
  setFontSize: (_v: number) => void
  setLineHeight: (_v: number) => void
  increaseFontSize: () => void
  decreaseFontSize: () => void
  increaseLineHeight: () => void
  decreaseLineHeight: () => void
  setArbitrary: (_s: Partial<SettingsState>) => void
  resetAll: () => void
  toggleInfoPanel: () => void
  toggleLineCount: () => void
  toggleVariableHeadings: () => void
  setTheme: (_t: Theme) => void
}

export const DEF_SETTINGS: SettingsState = {
  fontFace: 'JetBrains Mono Variable',
  fontSize: 16,
  lineHeight: 1.6,
  theme: 'light',
  showLineCount: true,
  showInfoPanel: true,
  variableHeadings: false
}

export const RANGE_LINE_HEIGHT = [1, 2]
export const RANGE_FONT_SIZE = [12, 24]

const useSettingsStore = create<SettingsState & SettingsMutate>((set) => ({
  ...DEF_SETTINGS,
  setFontFace: (ff: FontFace) => set({ fontFace: ff }),
  setFontSize: (v: number) =>
    set(() => ({ fontSize: clamp(v, RANGE_FONT_SIZE[0], RANGE_FONT_SIZE[1]) })),
  setLineHeight: (v: number) =>
    set(() => ({ lineHeight: clamp(v, RANGE_LINE_HEIGHT[0], RANGE_LINE_HEIGHT[1]) })),
  increaseFontSize: () =>
    set((state) => ({ fontSize: Math.min(state.fontSize + 1, RANGE_FONT_SIZE[1]) })),
  decreaseFontSize: () =>
    set((state) => ({ fontSize: Math.max(state.fontSize - 1, RANGE_FONT_SIZE[0]) })),
  increaseLineHeight: () =>
    set((state) => ({ lineHeight: Math.min(state.lineHeight + 0.25, RANGE_LINE_HEIGHT[1]) })),
  decreaseLineHeight: () =>
    set((state) => ({ lineHeight: Math.min(state.lineHeight - 0.25, RANGE_LINE_HEIGHT[0]) })),
  toggleLineCount: () => set((s) => ({ showLineCount: !s.showLineCount })),
  toggleInfoPanel: () => set((s) => ({ showInfoPanel: !s.showInfoPanel })),
  toggleVariableHeadings: () => set((s) => ({ variableHeadings: !s.variableHeadings })),
  setArbitrary: (s: Partial<SettingsState>) => set(s),
  setTheme: (t: Theme) => set({ theme: t }),
  resetAll: () => set(DEF_SETTINGS)
}))

export default useSettingsStore
