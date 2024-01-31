import { useShallow } from 'zustand/react/shallow'
import { Switch } from '@/components/UI'
import useSettingsStore from '@/store/settings'

export default function StatisticsSwitch() {
  const { showInfoPanel, toggleInfoPanel } = useSettingsStore(
    useShallow((s) => ({
      showInfoPanel: s.showInfoPanel,
      toggleInfoPanel: s.toggleInfoPanel
    }))
  )

  const handleInfoPanel = () => toggleInfoPanel()
  return <Switch title='Statistics' checked={showInfoPanel} onChange={handleInfoPanel}></Switch>
}
