import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import markdown from 'highlight.js/lib/languages/markdown'

hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('javascript', javascript)

const highlighter = (editor: HTMLElement) => {
  const code = editor.textContent
  editor.innerHTML = hljs.highlightAuto(code || '', ['markdown']).value
}

export default highlighter
