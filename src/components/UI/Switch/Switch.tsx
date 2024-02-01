import { SwitchOwnProps } from '@mui/base'
import { Switch as MUISwitch } from '@mui/base/Switch'
import cx from 'classnames'
import { Stack } from '../Layout'
import styles from './Switch.module.scss'

interface SwitchProps extends Omit<SwitchOwnProps, 'slots' | 'slotProps'> {
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
    defaultChecked,
    ...rest
  } = props

  const wrapperClass = cx(styles.wrapper, styles[direction], className)

  return (
    <Stack dir={direction} as='label' className={wrapperClass}>
      {title}
      <MUISwitch
        tabIndex={0}
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
        {...rest}
      />
    </Stack>
  )
}
