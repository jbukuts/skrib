import cx from 'classnames'
import { ForwardedRef, createElement, forwardRef } from 'react'
import styles from '../Layout.module.scss'

interface StackProps extends React.HTMLAttributes<HTMLElement> {
  dir?: 'horizontal' | 'vertical'
  className?: string
  children: React.ReactNode
  reverse?: boolean
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'none'
  as?: keyof React.ReactHTML
}

const dirMap: Record<NonNullable<StackProps['dir']>, string> = {
  horizontal: 'row',
  vertical: 'column'
}

function Stack(props: StackProps, ref: ForwardedRef<HTMLElement>) {
  const {
    dir = 'horizontal',
    className,
    children,
    reverse = false,
    spacing = 'md',
    as = 'div',
    autoFocus = false,
    style = {},
    ...rest
  } = props
  const directionStyle = `${dirMap[dir]}${reverse ? '-reverse' : ''}`

  const stackClass = cx(styles[spacing], className)

  return createElement(
    as,
    {
      ...rest,
      className: stackClass,
      ref,
      autoFocus,
      style: {
        ...style,
        display: 'flex',
        flexDirection: directionStyle as React.CSSProperties['flexDirection']
      }
    },
    children
  )
}

const ForwardStack = forwardRef<HTMLElement, StackProps>(Stack)

export default ForwardStack
