import { SwitchOwnProps } from '@mui/base'
import { Switch as MUISwitch } from '@mui/base/Switch'
import cx from 'classnames'
import { Stack } from '../Layout'
import styles from './Switch.module.scss'

type InheritedProps = Pick<
  SwitchOwnProps,
  'checked' | 'disabled' | 'onChange' | 'defaultChecked' | 'className'
>

interface SwitchProps extends InheritedProps {
  title?: string
  direction?: 'horizontal' | 'vertical'
}

export default function Switch(props: SwitchProps) {
  const {
    title,
    direction = 'vertical',
    className,
    onChange,
    disabled = false,
    checked,
    defaultChecked
  } = props

  const wrapperClass = cx(styles.wrapper, styles[direction], className)

  return (
    <Stack dir={direction} as='label' className={wrapperClass}>
      {title}
      <MUISwitch
        disabled={disabled}
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange}
        slotProps={{
          root: { className: styles.root },
          track: { className: styles.track },
          thumb: { className: styles.thumb },
          input: { className: styles.input }
        }}
      />
    </Stack>
  )
}
