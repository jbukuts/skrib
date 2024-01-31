import { Modal as BaseModal, ModalBackdropSlotProps, ModalOwnProps } from '@mui/base/Modal'
import { forwardRef } from 'react'
import { IoIosClose } from 'react-icons/io'
import { IconButton } from '..'
import { Stack } from '../Layout'
import styles from './Modal.module.scss'

interface ModalProps extends ModalOwnProps {
  title?: string
  renderCloseButton?: boolean
}

const Backdrop = forwardRef<HTMLDivElement, ModalBackdropSlotProps>((props, ref) => {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { open, ownerState, ...other } = props
  return <div ref={ref} {...other} />
})

export default function Modal(props: ModalProps) {
  const { open, onClose = () => null, renderCloseButton = true, title, children } = props

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      slots={{ backdrop: Backdrop }}
      slotProps={{ root: { className: styles.root }, backdrop: { className: styles.backdrop } }}>
      <Stack dir='vertical' className={styles.contentWrapper}>
        {renderCloseButton && (
          <IconButton
            size={32}
            icon={IoIosClose}
            onClick={() => onClose({}, 'backdropClick')}
            className={styles.closeButton}
          />
        )}

        <div className={styles.content}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {children}
        </div>
      </Stack>
    </BaseModal>
  )
}
