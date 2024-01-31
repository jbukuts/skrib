import { ButtonOwnProps, Button as MUIButton } from '@mui/base/Button'
import cx from 'classnames'
import styles from './Button.module.scss'

interface ButtonProps extends ButtonOwnProps {
  onClick: () => void
  color: 'mono' | 'submit' | 'danger' | 'success'
  style?: React.CSSProperties
}

export default function Button(props: ButtonProps) {
  const { className, disabled, children, onClick, color = 'mono', style = {} } = props

  const buttonClass = cx(styles.button, styles[color], className)

  return (
    <MUIButton disabled={disabled} className={buttonClass} onClick={onClick} style={style}>
      {children}
    </MUIButton>
  )
}
