import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import { search } from '@codemirror/search'
import { Tag, styleTags, tags } from '@lezer/highlight'
import { EditorView, Statistics, showPanel, useCodeMirror } from '@uiw/react-codemirror'
import cx from 'classnames'
import { useMemo, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { useMount } from 'react-use'
import { getColor, mixColors } from '@/helpers/common'
import styles from './CodeMirrorEditor.module.scss'
import './editor.scss'
import wordCountPanel from './panel'
import SearchPanel from './SearchPanel'

interface CodeMirrorEditorProps {
  code?: string
  onChange?: (_s: string) => void
  onStatistics?: (_s: Statistics) => void
  style?: React.CSSProperties
  className?: string
  lineNumbers?: boolean
  lineHeight?: number
  fontSize?: number
  fontFamily?: string
  showInfoPanel?: boolean
  variableHeadingSize?: boolean
  smoothCursorBlink?: boolean
  smoothCursorMove?: boolean

  // new
  cursorStyle?: 'line' | 'block' | 'underline'
  coloredHeadings?: boolean
  underlineHeadings?: boolean
  codeBlockHighlight?: boolean
}

const listBullet = Tag.define()
const quoteMark = Tag.define()

// baseline editor styling
const DEF_EDITOR_THEME = EditorView.theme({
  '.cm-gutters': {
    userSelect: 'none'
  },
  '.cm-gutterElement': { padding: '0 .875em !important' },
  // statistic panel
  '.cm-panels-bottom': {
    position: 'sticky',
    bottom: '0px',
    borderTop: 'none',
    padding: '0.25rem 0.5em',
    fontSize: '.875em'
  },
  '.cm-panels-bottom .cm-panel': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

// allows for larger headings
const VARIABLE_HEADING_HIGHLIGHTER = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.heading1, fontSize: '2em' },
    { tag: tags.heading2, fontSize: '1.65em' },
    { tag: tags.heading3, fontSize: '1.375em' },
    { tag: tags.heading4, fontSize: '1.25em' },
    { tag: tags.heading5, fontSize: '1.15em' },
    { tag: tags.heading6, fontSize: '1em' }
  ])
)

// apply theming to markdown syntax
const HIGHLIGHTER = (underlineHeading: boolean = true, colorHeading: boolean = true) =>
  syntaxHighlighting(
    HighlightStyle.define([
      {
        tag: tags.heading,
        fontWeight: 700,
        textDecoration: underlineHeading ? 'underline' : 'none',
        color: !colorHeading ? getColor('gray') : mixColors('blue', 'blue')
      },
      { tag: tags.strong, fontWeight: 700 },
      { tag: tags.emphasis, fontStyle: 'italic' },
      { tag: tags.strikethrough, textDecoration: 'line-through' },
      { tag: tags.list, color: getColor('gray') },
      { tag: tags.link, color: getColor('foreground') },
      { tag: tags.url, color: getColor('blue'), textDecoration: 'underline' },
      { tag: listBullet, color: getColor('blue') },
      { tag: quoteMark, color: mixColors('green', 'black', 90) }
    ])
  )

// apply theming to code block syntax
const CODE_BLOCK_HIGHLIGTER = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.lineComment, color: mixColors('gray', 'green', 10) },
    { tag: tags.keyword, color: getColor('blue') },
    { tag: tags.name, color: mixColors('white', 'blue') },
    { tag: tags.literal, color: mixColors('red', 'yellow', 35) },
    { tag: tags.integer, color: getColor('yellow') },
    { tag: tags.float, color: getColor('yellow') },
    { tag: tags.null, color: getColor('pink') },
    { tag: tags.bool, color: getColor('blue') },
    // typing
    { tag: tags.typeOperator, color: mixColors('red', 'blue', 70) },
    { tag: tags.typeName, color: mixColors('red', 'blue', 70) },
    // parentheses, function brackets
    { tag: tags.brace, color: getColor('yellow') },
    { tag: tags.bracket, color: getColor('yellow') },
    { tag: tags.escape, color: getColor('yellow') }
  ])
)

const SMOOTH_CURSOR_BLINK = EditorView.theme({
  '&.cm-focused .cm-cursorLayer': {
    animation: 'none !important'
  },
  '&.cm-focused .cm-cursor': {
    animation: '1200ms ease-in-out infinite alternate cm-blink !important'
  }
})

const SMOOTH_CURSOR_MOVE = EditorView.theme({
  '&.cm-focused .cm-cursor': {
    borderLeftColor: getColor('foreground'),
    transitionProperty: 'left, right, top',
    transitionDuration: '50ms',
    transitionTimeFunction: 'linear'
  }
})

export default function CodeMirrorEditor(props: CodeMirrorEditorProps) {
  const {
    code = '',
    onChange = () => null,
    onStatistics = () => null,
    style = {},
    className,
    lineNumbers = true,
    lineHeight = 1.5,
    fontSize = 18,
    fontFamily = 'serif',
    showInfoPanel = true,
    variableHeadingSize = true,
    smoothCursorBlink = false,
    smoothCursorMove = false,
    codeBlockHighlight = true,
    coloredHeadings = false,
    underlineHeadings = true
  } = props

  const appliedTheme = EditorView.theme({
    '&': { fontSize: `${fontSize}px` /*transition: 'font-size 100ms ease-in-out'*/ },
    '.cm-content': { fontFamily },
    '.cm-line': { lineHeight /*transition: 'line-height 50ms ease-in-out'*/, padding: '0 0.875em' }
  })

  const standardHighlighter = useMemo(
    () => HIGHLIGHTER(underlineHeadings, coloredHeadings),
    [underlineHeadings, coloredHeadings]
  )

  const editor = useRef<HTMLDivElement>(null)
  const { setContainer } = useCodeMirror({
    container: editor.current,
    basicSetup: {
      autocompletion: false,
      allowMultipleSelections: false,
      lineNumbers,
      foldGutter: false
    },
    extensions: [
      EditorView.contentAttributes.of({
        id: 'skrib-editor',
        'aria-label': 'skrib-editor',
        'data-gram': 'false',
        'data-gram_editor': 'false',
        'data-enable-grammarly': 'false'
      }),
      DEF_EDITOR_THEME,
      appliedTheme,
      showPanel.of(showInfoPanel ? wordCountPanel : null),
      search({
        top: true,
        createPanel: (view) => {
          const dom = document.createElement('div')
          const root = createRoot(dom)
          root.render(<SearchPanel view={view} />)
          return { dom, top: true }
        }
      }),
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
        extensions: { props: [styleTags({ ListMark: listBullet, QuoteMark: quoteMark })] }
      }),
      standardHighlighter,
      ...(codeBlockHighlight ? [CODE_BLOCK_HIGHLIGTER] : []),
      ...(variableHeadingSize ? [VARIABLE_HEADING_HIGHLIGHTER] : []),
      ...(smoothCursorBlink ? [SMOOTH_CURSOR_BLINK] : []),
      ...(smoothCursorMove ? [SMOOTH_CURSOR_MOVE] : []),
      EditorView.lineWrapping
    ],
    value: code,
    onChange,
    onStatistics
  })

  useMount(() => {
    if (!editor.current) return
    setContainer(editor.current)
  })

  const editorClass = cx(styles.editor, className)

  return <div ref={editor} style={style} className={editorClass} />
}
