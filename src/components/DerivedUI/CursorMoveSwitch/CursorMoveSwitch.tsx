import { useShallow } from 'zustand/react/shallow'
import { Switch } from '@/components/UI'
import useSettingsStore from '@/store/settings'

export default function CursorMoveSwitch() {
  const { smoothCursorMove, toggleSmoothCursorMove } = useSettingsStore(
    useShallow((s) => ({
      smoothCursorMove: s.smoothCursorMove,
      toggleSmoothCursorMove: s.toggleSmoothCursorMove
    }))
  )

  return <Switch title='Cursor Move' onChange={toggleSmoothCursorMove} checked={smoothCursorMove} />
}
