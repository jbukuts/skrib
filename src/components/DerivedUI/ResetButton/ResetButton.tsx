import { Button } from '@/components/UI'
import useSettingsStore from '@/store/settings'

export default function ResetButton() {
  const resetAll = useSettingsStore((s) => s.resetAll)

  return (
    <Button color='danger' onClick={resetAll} style={{ marginTop: '.5rem' }}>
      Reset All Settings
    </Button>
  )
}
