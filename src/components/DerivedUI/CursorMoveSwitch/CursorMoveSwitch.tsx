import { Switch } from '@/components/UI'
import { useUserSettings } from '@/hooks'

export default function CursorMoveSwitch() {
  const { smoothCursorMove, toggleSmoothCursorMove } = useUserSettings()

  return <Switch title='Cursor Move' onChange={toggleSmoothCursorMove} checked={smoothCursorMove} />
}
