import { useShallow } from 'zustand/react/shallow'
import { Switch } from '@/components/UI'
import useSettingsStore from '@/store/settings'

export default function CursorBlinkSwitch() {
  const { toggleSmoothCursorBlink, smoothCursorBlink } = useSettingsStore(
    useShallow((s) => ({
      toggleSmoothCursorBlink: s.toggleSmoothCursorBlink,
      smoothCursorBlink: s.smoothCursorBlink
    }))
  )

  return (
    <Switch
      onChange={toggleSmoothCursorBlink}
      checked={smoothCursorBlink}
      title='Smooth Cursor Blink'
    />
  )
}
