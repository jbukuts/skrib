import { useShallow } from 'zustand/react/shallow'
import { NewSlider } from '@/components/UI'
import useSettingsStore from '@/store/settings'

export default function FontSizeSlider() {
  const { fontSize, setFontSize } = useSettingsStore(
    useShallow((s) => ({
      fontSize: s.fontSize,
      setFontSize: s.setFontSize
    }))
  )

  const handleFontSize = (fs: string) => setFontSize(parseInt(fs))

  return (
    <NewSlider
      title='Font Size'
      value={fontSize}
      min={12}
      max={24}
      step={1}
      onChange={(_e: Event, v) => handleFontSize(`${v as number}px`)}
    />
  )
}
