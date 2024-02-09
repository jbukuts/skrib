import { Button } from '@/components/UI'
import { useUserSettings } from '@/hooks'

export default function ResetButton() {
  const { resetAll } = useUserSettings()

  return (
    <Button color='danger' onClick={resetAll} style={{ marginTop: '.5rem' }}>
      Reset All Settings
    </Button>
  )
}
