import { Switch } from '@/components/UI'
import { useUserSettings } from '@/hooks'

export default function ColorHeadingSwitch() {
  const { coloredHeadings, toggleColorHeadings } = useUserSettings()

  const handleToggleColorHeading = () => toggleColorHeadings()
  return (
    <Switch
      title='Color Headings'
      checked={coloredHeadings}
      onChange={handleToggleColorHeading}></Switch>
  )
}
