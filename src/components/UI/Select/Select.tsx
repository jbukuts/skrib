import { Option } from '@mui/base'
import { Select as MUISelect, SelectOwnProps, SelectRootSlotProps } from '@mui/base/Select'
import cx from 'classnames'
import { forwardRef } from 'react'
import { Stack } from '../Layout'
import styles from './Select.module.scss'

type InheritedProps = SelectOwnProps<object | string, false>

interface Item {
  title?: string
  value: React.OptionHTMLAttributes<HTMLOptionElement>['value']
}

interface SelectProps extends InheritedProps {
  title?: string
  items: Item[] | string[]
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef(function Button<TValue extends object, Multiple extends boolean>(
  props: SelectRootSlotProps<TValue, Multiple>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { ownerState, ...other } = props
  return (
    <button type='button' {...other} ref={ref}>
      {other.children}
    </button>
  )
})

export default function Select(props: SelectProps) {
  const { title = '', items, value, onChange, className, size = 'md' } = props

  const selectClass = cx(styles.wrapper, styles[size], className)

  return (
    <Stack as='label' dir='vertical' className={selectClass}>
      {title}
      <MUISelect
        onChange={onChange}
        value={value}
        slots={{ root: Button }}
        slotProps={{
          root: { className: styles.root },
          listbox: { className: styles.listbox },
          popup: { className: styles.popup }
        }}>
        {items.map((item, index) => {
          const { title, value } = typeof item === 'string' ? { title: item, value: item } : item
          return (
            <Option key={index} className={styles.option} value={value} label={title}>
              {title || value}
            </Option>
          )
        })}
      </MUISelect>
    </Stack>
  )
}
