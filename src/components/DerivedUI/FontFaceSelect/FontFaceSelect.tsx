import { useShallow } from 'zustand/react/shallow'
import { Select } from '@/components/UI'
import useSettingsStore, { FontFace } from '@/store/settings'

const FONT_OPTIONS: FontFace[] = [
  'IBM Plex Sans',
  'IBM Plex Serif',
  'IBM Plex Mono',
  'Ubuntu',
  'Ubuntu Mono',
  'Open Sans',
  'JetBrains Mono Variable'
]

export default function FontFaceSelect() {
  const { fontFace, setFontFace } = useSettingsStore(
    useShallow((s) => ({
      fontFace: s.fontFace,
      setFontFace: s.setFontFace
    }))
  )

  const handleFontChange = (f: string) => setFontFace(f as FontFace)

  return (
    <Select
      title='Font Face'
      items={FONT_OPTIONS}
      value={fontFace as string}
      onChange={(_e, v) => v && handleFontChange(String(v))}
    />
  )
}
