import cx from 'classnames'
import { useEffect, useState } from 'react'
import styles from './Slider.module.scss'

interface SliderProps {
  title?: string
  min: number
  max: number
  value?: number
  step?: number
  onChange?: (_v: number) => void
  direction?: 'horizontal' | 'vertical'
  className?: string
}

export default function Slider(props: SliderProps) {
  const {
    min,
    max,
    value,
    title,
    step = 1,
    onChange = () => null,
    direction = 'vertical',
    className: c
  } = props

  const [internal, setInternal] = useState(value)

  useEffect(() => {
    setInternal(value)
  }, [value])

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = parseFloat(e.target.value)
    setInternal(val)
    onChange(val)
  }

  const className = cx(styles.slider, styles[direction], c)

  return (
    <label className={className}>
      {title}: {value}
      <input
        type='range'
        min={min}
        max={max}
        value={internal}
        step={step}
        id='myRange'
        onChange={handleChange}></input>
    </label>
  )
}
