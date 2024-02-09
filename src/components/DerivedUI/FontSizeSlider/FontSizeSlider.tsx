import { NewSlider } from '@/components/UI'
import { useUserSettings } from '@/hooks'

export default function FontSizeSlider() {
  const { fontSize, setFontSize } = useUserSettings()

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
