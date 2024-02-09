import { useLocalStorage } from '@uidotdev/usehooks'
import { LOCAL_STORAGE_MAP } from '@/constants'
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
  smoothCursorBlink: boolean
  smoothCursorMove: boolean
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
  toggleSmoothCursorBlink: () => void
  toggleSmoothCursorMove: () => void
}

export const DEF_SETTINGS: SettingsState = {
  fontFace: 'JetBrains Mono Variable',
  fontSize: 16,
  lineHeight: 1.6,
  theme: 'light',
  showLineCount: true,
  showInfoPanel: true,
  variableHeadings: false,
  smoothCursorBlink: false,
  smoothCursorMove: false
}

export const RANGE_LINE_HEIGHT = [1, 2]
export const RANGE_FONT_SIZE = [12, 24]
const { userSettings: userSettingsKey } = LOCAL_STORAGE_MAP

export default function useUserSettings() {
  const [settings, setSettings] = useLocalStorage<SettingsState>(userSettingsKey, DEF_SETTINGS)

  const set = (v: Partial<SettingsState> | ((c: SettingsState) => Partial<SettingsState>)) => {
    if (typeof v === 'function') {
      const newVal = v(settings)
      setSettings({ ...settings, ...newVal })

      // setSettings((oldSettings) => {
      //   const newVal = v(oldSettings)
      //   console.log(newVal)
      //   return { ...oldSettings, ...newVal }
      // })
    } else {
      setSettings({ ...settings, ...v })
    }
  }

  return {
    ...settings,
    setFontFace: (ff: FontFace) => set({ fontFace: ff }),
    setFontSize: (v: number) => set({ fontSize: clamp(v, RANGE_FONT_SIZE[0], RANGE_FONT_SIZE[1]) }),
    setLineHeight: (v: number) =>
      set({ lineHeight: clamp(v, RANGE_LINE_HEIGHT[0], RANGE_LINE_HEIGHT[1]) }),
    toggleLineCount: () => set((s) => ({ showLineCount: !s.showLineCount })),
    toggleInfoPanel: () => set((s) => ({ showInfoPanel: !s.showInfoPanel })),
    toggleVariableHeadings: () => set((s) => ({ variableHeadings: !s.variableHeadings })),
    toggleSmoothCursorBlink: () => set((s) => ({ smoothCursorBlink: !s.smoothCursorBlink })),
    toggleSmoothCursorMove: () => set((s) => ({ smoothCursorMove: !s.smoothCursorMove })),
    setArbitrary: (s: Partial<SettingsState>) => set(s),
    setTheme: (t: Theme) => set({ theme: t }),
    resetAll: () => set(DEF_SETTINGS)
  } as SettingsMutate & SettingsState
}
