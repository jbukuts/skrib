import { useUserSettings } from '@/hooks'
import { Theme } from '@/hooks/useUserSettings'
import { Select } from '../../UI'

interface ThemeSelectProps {
  showTitle?: boolean
}

const THEME_LIST = [
  {
    title: 'Light',
    value: 'light'
  },
  {
    title: 'Dark',
    value: 'dark'
  },
  { title: 'Monokai', value: 'monokai' }
]

export default function ThemeSelect(props: ThemeSelectProps) {
  const { showTitle = false } = props

  const { theme, setTheme } = useUserSettings()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (_e: any, v: string | object | null) => {
    if (!v || typeof v !== 'string') return
    setTheme(v as Theme)
  }

  return (
    <Select
      title={showTitle ? 'Theme' : undefined}
      items={THEME_LIST}
      onChange={handleChange}
      value={theme}
      size='sm'></Select>
  )
}
