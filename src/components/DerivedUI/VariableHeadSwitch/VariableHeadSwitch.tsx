import { useShallow } from 'zustand/react/shallow'
import { Switch } from '@/components/UI'
import useSettingsStore from '@/store/settings'

export default function VariableHeadSwitch() {
  const { variableHeadings, toggleVariableHeadings } = useSettingsStore(
    useShallow((s) => ({
      variableHeadings: s.variableHeadings,
      toggleVariableHeadings: s.toggleVariableHeadings
    }))
  )

  return (
    <Switch
      title='Scaled Headings'
      checked={variableHeadings}
      onChange={toggleVariableHeadings}></Switch>
  )
}
