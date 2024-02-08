import { VscSettingsGear } from 'react-icons/vsc'
import { useShallow } from 'zustand/react/shallow'
import { IconButton } from '@/components/UI'
import { Stack } from '@/components/UI/Layout'
import useEditorStateStore from '@/store/editor-state'
import PreviewButtons from '../DerivedUI/PreviewButtons'
import styles from './TopBar.module.scss'

export default function TopBar() {
  const { toggleSettings } = useEditorStateStore(
    useShallow((s) => ({
      toggleSettings: s.toggleSettings
    }))
  )

  return (
    <Stack dir='horizontal' className={styles.topBar}>
      <p>
        skrib <i>(wip)</i>
      </p>
      <Stack dir='horizontal' spacing='sm' style={{ alignItems: 'center' }}>
        <PreviewButtons />
        <IconButton
          title='Show settings'
          size={22}
          icon={VscSettingsGear}
          onClick={toggleSettings}
        />
      </Stack>
    </Stack>
  )
}
