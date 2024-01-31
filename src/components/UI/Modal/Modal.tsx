import cx from 'classnames'
import { useEffect, useRef } from 'react'
import { IoIosClose } from 'react-icons/io'
import { IconButton } from '..'
import styles from './Modal.module.scss'

interface ModalProps {
  show?: boolean
  onClose?: () => void
  onOpen?: () => void
  backdropClose?: boolean
  className?: string
  children?: React.ReactNode
  renderCloseButton?: boolean
}

export default function Modal(props: ModalProps) {
  const {
    show = false,
    onClose = () => null,
    onOpen = () => null,
    backdropClose = false,
    className,
    children,
    renderCloseButton = true
  } = props
  const modalRef = useRef<HTMLDialogElement>(null)

  const handleClick: React.MouseEventHandler<HTMLDialogElement> = (e) => {
    const rect = (e.target as HTMLDialogElement).getBoundingClientRect()
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width

    if (!isInDialog && backdropClose) {
      modalRef.current?.close()
    }
  }

  useEffect(() => {
    if (!modalRef.current) return
    else if (show) onOpen()

    modalRef.current[show ? 'showModal' : 'close']()
  }, [show])

  return (
    <dialog
      ref={modalRef}
      onClick={handleClick}
      className={cx(styles.modal, className)}
      onClose={onClose}>
      {renderCloseButton && <IconButton size={24} icon={IoIosClose} onClick={onClose}></IconButton>}
      {children}
    </dialog>
  )
}
