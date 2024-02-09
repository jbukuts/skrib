import { Switch } from '@/components/UI'
import { useUserSettings } from '@/hooks'

export default function CursorBlinkSwitch() {
  const { toggleSmoothCursorBlink, smoothCursorBlink } = useUserSettings()

  return (
    <Switch
      onChange={toggleSmoothCursorBlink}
      checked={smoothCursorBlink}
      title='Smooth Cursor Blink'
    />
  )
}
