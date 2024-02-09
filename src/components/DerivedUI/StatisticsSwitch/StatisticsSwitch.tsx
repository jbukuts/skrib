import { Switch } from '@/components/UI'
import { useUserSettings } from '@/hooks'

export default function StatisticsSwitch() {
  const { showInfoPanel, toggleInfoPanel } = useUserSettings()

  const handleInfoPanel = () => toggleInfoPanel()
  return <Switch title='Statistics' checked={showInfoPanel} onChange={handleInfoPanel}></Switch>
}
