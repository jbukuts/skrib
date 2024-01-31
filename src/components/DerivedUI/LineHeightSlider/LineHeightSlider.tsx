import { useShallow } from 'zustand/react/shallow'
import { NewSlider } from '@/components/UI'

import useSettingsStore from '@/store/settings'

export default function LineHeightSlider() {
  const { lineHeight, setLineHeight } = useSettingsStore(
    useShallow((s) => ({
      lineHeight: s.lineHeight,
      setLineHeight: s.setLineHeight
    }))
  )

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
