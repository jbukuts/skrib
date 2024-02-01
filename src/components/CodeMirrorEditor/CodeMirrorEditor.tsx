import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import { search } from '@codemirror/search'
import { tags } from '@lezer/highlight'
import { EditorView, Statistics, showPanel, useCodeMirror } from '@uiw/react-codemirror'
import cx from 'classnames'
import { useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { useMount } from 'react-use'
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
  cursorStyle?: 'line' | 'block' | 'underline'
}

// baseline editor styling
const DEF_EDITOR_THEME = EditorView.theme({
  // '.cm-selectionMatch': { backgroundColor: 'rgba(191, 191, 0, 0.4)' },
  // '.cm-activeLine': { backgroundColor: 'rgba(0,0,0,.05)' },
  //'.cm-activeLineGutter': { backgroundColor: 'rgba(0,0,0,.05)' },
  '.cm-gutters': {
    // backgroundColor: 'rgba(0,0,0,.05)',
    // borderRight: '1px solid rgb(212, 212, 212)',
    userSelect: 'none'
  },
  '.cm-gutterElement': { padding: '0 .875em !important' },
  '.cm-panels-bottom': {
    // backgroundColor: 'rgba(164, 164, 164, 0.55)',
    position: 'sticky',
    bottom: '0px',
    borderTop: 'none',
    backdropFilter: 'blur(10px)',
    padding: '0.25rem 0.5em',
    fontSize: '.875em'
  },
  '.cm-panels-bottom .cm-panel': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

const getColor = (name: string, opacity: number = 1) => `rgba(var(--color-${name}), ${opacity})`

const headingStyle = { fontWeight: 700, textDecoration: 'underline', color: getColor('gray-1') }

// allows for larger headings
const VARIABLE_HEADING_HIGHLIGHTER = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.heading1, fontSize: '1.75em', ...headingStyle },
    { tag: tags.heading2, fontSize: '1.5em', ...headingStyle },
    { tag: tags.heading3, fontSize: '1.375em', ...headingStyle },
    { tag: tags.heading4, fontSize: '1.25em', ...headingStyle },
    { tag: tags.heading5, fontSize: '1.15em', ...headingStyle },
    { tag: tags.heading6, fontSize: '1em', ...headingStyle }
  ])
)

// apply theming to syntax
const HIGHLIGHTER = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.heading, ...headingStyle },
    { tag: tags.strong, fontWeight: 700 },
    { tag: tags.emphasis, fontStyle: 'italic' },
    { tag: tags.strikethrough, textDecoration: 'line-through' },
    { tag: tags.keyword, color: getColor('blue') },
    { tag: tags.link, color: 'red' },
    { tag: tags.brace, color: 'green' },
    { tag: tags.bracket, color: 'blue' },
    { tag: tags.bracket, color: 'purple' }
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
    smoothCursorMove = false
  } = props

  const appliedTheme = EditorView.theme({
    '&': { fontSize: `${fontSize}px` /*transition: 'font-size 100ms ease-in-out'*/ },
    '.cm-content': { fontFamily },
    '.cm-line': { lineHeight /*transition: 'line-height 50ms ease-in-out'*/, padding: '0 0.875em' }
  })

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
      EditorView.contentAttributes.of({ id: 'skrib-editor', 'aria-label': 'skrib-editor' }),
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
      markdown({ base: markdownLanguage, codeLanguages: languages }),
      HIGHLIGHTER,
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
