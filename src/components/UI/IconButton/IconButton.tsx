import cx from 'classnames'
import { createElement } from 'react'
import { IconType } from 'react-icons'
import styles from './IconButton.module.scss'

interface IconButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon: IconType
  size?: number
  disabled?: boolean
}

export default function IconButton(props: IconButtonProps) {
  const { icon, className, size = 24, disabled = false, ...rest } = props

  const iconBtnClass = cx(styles.iconButton, className)
  return (
    <button className={iconBtnClass} type='button' disabled={disabled} {...rest}>
      {createElement(icon, { size })}
    </button>
  )
}
