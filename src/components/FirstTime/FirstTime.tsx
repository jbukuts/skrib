import { Stack } from '../UI/Layout'
import styles from './FirstTime.module.scss'

interface KeyBindProps {
  cmd: string
  desc: string
}

const KEYBINDS: KeyBindProps[] = [
  {
    cmd: 'ctrl + M',
    desc: 'Open the settings menu'
  },
  { cmd: 'ctrl + B', desc: 'Toggle preview mode' },
  { cmd: 'ctrl + l', desc: 'Toggle line numbers' },
  { cmd: 'ctrl + s', desc: 'Save current file to disk' }
]

function KeyBind(props: { cmd: string; desc: string }) {
  const { cmd, desc } = props

  const appVersion = window.navigator.userAgent
  const isControl = appVersion.indexOf('Windows') > -1

  return (
    <Stack className={styles.keyBind}>
      <div>{cmd.replace('ctrl', isControl ? 'control' : 'command')}</div>
      <p>{desc}</p>
    </Stack>
  )
}

export default function FirstTime() {
  return (
    <Stack dir='vertical'>
      <p>Welcome to skib. A customizable Markdown editor for the browser.</p>

      <h4>Keybinds</h4>
      {KEYBINDS.map((kb, index) => (
        <KeyBind key={index} {...kb} />
      ))}
    </Stack>
  )
}
