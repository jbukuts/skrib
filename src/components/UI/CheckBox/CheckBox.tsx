import cx from 'classnames'
import styles from './CheckBox.module.scss'

interface CheckBoxProps {
  title?: string
  defaultChecked?: boolean
  onChange?: (_v: boolean) => void
}

export default function CheckBox(props: CheckBoxProps) {
  const { defaultChecked = false, onChange = () => null, title = '' } = props

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked)
  }

  const checkboxClass = cx(styles.checkbox)

  return (
    <label className={checkboxClass}>
      {title}
      <input type='checkbox' checked={defaultChecked} onChange={handleChange}></input>
    </label>
  )
}
