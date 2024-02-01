import { InputOwnProps, Input as MUIInput } from '@mui/base/Input'
import styles from './Input.module.scss'

export default function Input(props: InputOwnProps) {
  return <MUIInput {...props} slotProps={{ input: { className: styles.input } }}></MUIInput>
}
