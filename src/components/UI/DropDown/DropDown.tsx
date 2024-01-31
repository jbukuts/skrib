import cx from 'classnames'
import styles from './DropDown.module.scss'

interface Item {
  title?: string
  value: React.OptionHTMLAttributes<HTMLOptionElement>['value']
}

interface DropDownProps {
  title?: string
  items: Item[]
  direction?: 'horizontal' | 'vertical'
  onChange: (_v: string) => void
  defaultValue?: Item['value']
  value?: Item['value']
  className?: string
}

export default function DropDown(props: DropDownProps) {
  const {
    items,
    title = '',
    direction = 'vertical',
    onChange,
    defaultValue,
    value,
    className: c
  } = props

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    onChange(e.target.value)
  }

  const className = cx(styles.dropdown, styles[direction], c)

  return (
    <label className={className}>
      {title}:
      <select onChange={handleChange} defaultValue={defaultValue} value={value}>
        {items.map((item, ind) => {
          const { title, value } = item
          return (
            <option key={ind} value={value}>
              {title || value}
            </option>
          )
        })}
      </select>
    </label>
  )
}
