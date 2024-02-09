import { NewSlider } from '@/components/UI'
import { useUserSettings } from '@/hooks'

export default function LineHeightSlider() {
  const { lineHeight, setLineHeight } = useUserSettings()

  const handleLineHeight = (v: number) => setLineHeight(v)

  return (
    <NewSlider
      title='Line Height'
      value={lineHeight}
      min={1}
      max={2}
      step={0.1}
      onChange={(_e: Event, v) => handleLineHeight(v as number)}></NewSlider>
  )
}
