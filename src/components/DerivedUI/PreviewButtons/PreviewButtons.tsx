import cx from 'classnames'
import { VscCode, VscOpenPreview } from 'react-icons/vsc'
import { useShallow } from 'zustand/react/shallow'
import { IconButton } from '@/components/UI'
import { Stack } from '@/components/UI/Layout'
import useEditorStateStore from '@/store/editor-state'
import styles from './PreviewButtons.module.scss'

const ICON_SIZE = 22

export default function PreviewButtons() {
  const { showPreview, setArb } = useEditorStateStore(
    useShallow((s) => ({ showPreview: s.showPreview, setArb: s.setArbitrary }))
  )

  return (
    <Stack spacing='xs' className={styles.wrapper}>
      <IconButton
        title='Show Markdown view'
        size={ICON_SIZE}
        className={cx(showPreview && styles.inactive)}
        icon={VscCode}
        onClick={() => setArb({ showPreview: false })}></IconButton>
      <IconButton
        title='Show HTML view'
        size={ICON_SIZE}
        className={cx(!showPreview && styles.inactive)}
        icon={VscOpenPreview}
        onClick={() => setArb({ showPreview: true })}></IconButton>
    </Stack>
  )
}
