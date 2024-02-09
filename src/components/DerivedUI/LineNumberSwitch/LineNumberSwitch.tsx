import { Switch } from '@/components/UI'
import { useUserSettings } from '@/hooks'

export default function LineNumberSwitch() {
  const { showLineCount, toggleLineCount } = useUserSettings()
  const handleLineCount = () => toggleLineCount()
  return <Switch title='Line Numbers' checked={showLineCount} onChange={handleLineCount} />
}
