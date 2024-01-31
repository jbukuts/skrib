import { useShallow } from 'zustand/react/shallow'
import { Switch } from '@/components/UI'
import useSettingsStore from '@/store/settings'

export default function LineNumberSwitch() {
  const { showLineCount, toggleLineCount } = useSettingsStore(
    useShallow((s) => ({
      showLineCount: s.showLineCount,

      toggleLineCount: s.toggleLineCount
    }))
  )

  const handleLineCount = () => toggleLineCount()
  return <Switch title='Line Numbers' checked={showLineCount} onChange={handleLineCount} />
}
