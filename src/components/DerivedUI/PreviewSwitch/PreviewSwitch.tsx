import cx from 'classnames'
import { FaAlignLeft, FaCode } from 'react-icons/fa6'
import { useShallow } from 'zustand/react/shallow'
import { Stack } from '@/components/UI/Layout'
import useEditorStateStore from '@/store/editor-state'
import { Switch } from '../../UI'
import styles from './PreviewSwitch.module.scss'

const { inactive, icon } = styles

const ICON_SIZE = 22

export default function PreviewSwitch() {
  const { showPreview, togglePreview } = useEditorStateStore(
    useShallow((s) => ({ showPreview: s.showPreview, togglePreview: s.togglePreview }))
  )

  const handlePreviewChange = () => togglePreview()
  return (
    <Stack style={{ alignItems: 'center', gap: '0.575rem' }}>
      <FaCode className={cx(icon, showPreview && inactive)} size={ICON_SIZE} />
      <Switch checked={showPreview} onChange={handlePreviewChange}></Switch>
      <FaAlignLeft className={cx(icon, !showPreview && inactive)} size={ICON_SIZE} />
    </Stack>
  )
}
