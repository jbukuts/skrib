import { InputOwnProps, Input as MUIInput } from '@mui/base/Input'
import styles from './Input.module.scss'

interface CustomInputProps {
  errorReason?: string
}

export default function Input(props: InputOwnProps & CustomInputProps) {
  return (
    <MUIInput
      {...props}
      slotProps={{
        input: { className: styles.input },
        root: { className: styles.root }
      }}></MUIInput>
  )
}
