import { Slider as MUISlider, SliderOwnProps } from '@mui/base/Slider'
import React from 'react'
import { Stack } from '../Layout'
import styles from './Slider.module.scss'

type InheritedProps = SliderOwnProps

interface SliderProps extends InheritedProps {
  title?: string
}

function SliderValue({ children }: { children: React.ReactNode }) {
  return <span className={styles.valueLabel}>{children}</span>
}

export default function Slider(props: SliderProps) {
  const { title, min = 0, max = 10, defaultValue, value, step = 1, marks = false, onChange } = props
  return (
    <Stack as='label' dir='vertical' className={styles.wrapper}>
      {title}
      <MUISlider
        tabIndex={0}
        onChange={onChange}
        defaultValue={defaultValue}
        value={value}
        max={max}
        min={min}
        marks={marks}
        step={step}
        slots={{ valueLabel: SliderValue }}
        slotProps={{
          root: { className: styles.root },
          rail: { className: styles.rail },
          track: { className: styles.track },
          thumb: { className: styles.thumb },
          mark: { className: styles.mark },
          markLabel: { className: styles.markLabel },
          valueLabel: { className: styles.valueLabel }
        }}
      />
    </Stack>
  )
}
