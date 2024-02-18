import cx from 'classnames'
import { createElement } from 'react'
import styles from '../Layout.module.scss'

interface GridProps {
  col?: number
  row?: number
  children: React.ReactNode
  className?: string
  spacing?: 'xs' | 'sm' | 'md' | 'lg'
  as?: keyof React.ReactHTML
}

export default function Grid(props: GridProps) {
  const { row, col, className, children, spacing = 'md', as = 'div' } = props

  const gridClass = cx(styles[spacing], className)

  return createElement(
    as,
    {
      className: gridClass,
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${col || 'auto'}, 1fr)`,
        gridTemplateRows: `repeat(${row || 'auto'}, 1fr)`
      }
    },
    children
  )
}
