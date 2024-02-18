import { Switch } from '@/components/UI'
import { useUserSettings } from '@/hooks'

export default function UnderlineHeadingSwitch() {
  const { underlineHeadings, toggleUnderlineHeadings } = useUserSettings()

  const handleToggleUnderline = () => toggleUnderlineHeadings()
  return (
    <Switch
      title='Underline Headings'
      checked={underlineHeadings}
      onChange={handleToggleUnderline}></Switch>
  )
}
