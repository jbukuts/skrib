import cx from 'classnames'
import { useEffect, useState } from 'react'
import rehypeAutoLinkHeadings from 'rehype-autolink-headings'
import rehypeFormat from 'rehype-format'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkBreak from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import styles from './Preview.module.scss'

interface PreviewProps {
  rawText: string
  className?: string
  fontSize: number
  lineHeight: number
}

function createHTML(rawMarkdown: string) {
  return (
    unified()
      // TODO gate these behind settings
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkBreak)
      .use(remarkRehype)
      .use(rehypeFormat)
      .use(rehypeHighlight)
      .use(rehypeSlug)
      .use(rehypeAutoLinkHeadings, { behavior: 'wrap', test: ['h2', 'h3', 'h4', 'h5', 'h6'] })
      .use(rehypeStringify)
      .process(rawMarkdown)
      .then((f) => String(f))
  )
}

export default function Preview(props: PreviewProps) {
  const { rawText, fontSize, lineHeight, className } = props

  const [parsed, setParsed] = useState<string>('')

  useEffect(() => {
    createHTML(rawText).then((t) => setParsed(t))
  }, [rawText])

  const previewClass = cx(styles.preview, className)

  return (
    <div
      className={previewClass}
      dangerouslySetInnerHTML={{ __html: parsed }}
      style={{ fontSize: `${fontSize}px`, lineHeight }}></div>
  )
}
