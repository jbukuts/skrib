import cx from 'classnames'
import { marked } from 'marked'
import { useEffect, useState } from 'react'
import styles from './Preview.module.scss'

interface PreviewProps {
  rawText: string
  className?: string
  fontSize: number
}

export default function Preview(props: PreviewProps) {
  const { rawText, fontSize, className } = props

  const [parsed, setParsed] = useState<string>('')

  useEffect(() => {
    setParsed(marked.parse(rawText) as string)
  }, [rawText])

  const previewClass = cx(styles.preview, className)

  return (
    <div
      className={previewClass}
      dangerouslySetInnerHTML={{ __html: parsed }}
      style={{ fontSize: `${fontSize}px` }}></div>
  )
}
