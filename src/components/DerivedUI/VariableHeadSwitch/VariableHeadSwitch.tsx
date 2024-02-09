import { Switch } from '@/components/UI'
import { useUserSettings } from '@/hooks'

export default function VariableHeadSwitch() {
  const { variableHeadings, toggleVariableHeadings } = useUserSettings()

  return (
    <Switch
      title='Scaled Headings'
      checked={variableHeadings}
      onChange={toggleVariableHeadings}></Switch>
  )
}
