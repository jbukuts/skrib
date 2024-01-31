import cx from 'classnames'
import { FaAlignLeft, FaCode } from 'react-icons/fa6'
import { useShallow } from 'zustand/react/shallow'
import { IconButton } from '@/components/UI'
import { Stack } from '@/components/UI/Layout'
import useEditorStateStore from '@/store/editor-state'
import styles from './PreviewButtons.module.scss'

const ICON_SIZE = 24

export default function PreviewButtons() {
  const { showPreview, setArb } = useEditorStateStore(
    useShallow((s) => ({ showPreview: s.showPreview, setArb: s.setArbitrary }))
  )

  return (
    <Stack>
      <IconButton
        size={ICON_SIZE}
        className={cx(showPreview && styles.inactive)}
        icon={FaCode}
        onClick={() => setArb({ showPreview: false })}></IconButton>
      <IconButton
        size={ICON_SIZE}
        className={cx(!showPreview && styles.inactive)}
        icon={FaAlignLeft}
        onClick={() => setArb({ showPreview: true })}></IconButton>
    </Stack>
  )
}
