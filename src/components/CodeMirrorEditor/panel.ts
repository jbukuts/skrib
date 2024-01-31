import { EditorState, Text } from '@codemirror/state'
import { EditorView, Panel } from '@codemirror/view'

/**
 * Will count the words in a given document
 * @param {Text} doc given document to count words in
 * @returns {number} number of words counted
 */
function countWords(doc: Text) {
  let count = 0
  const iter = doc.iter()
  while (!iter.next().done) {
    let inWord = false
    for (let i = 0; i < iter.value.length; i++) {
      const word = /\w/.test(iter.value[i])
      if (word && !inWord) count++
      inWord = word
    }
  }
  return count
}

/**
 * Helper to create string of stats to track across edits
 * @param {EditorState} state
 * @returns {string} contains pertinent infomation to display
 */
const createText = (state: EditorState) => {
  const { doc } = state

  const wordCout = countWords(doc)
  const lineCount = doc.lines

  return `${wordCout} words ${lineCount} lines`
}

/**
 * Help to create string of cursor position in editor
 *
 * Reference:
 * - Column: https://discuss.codemirror.net/t/get-the-current-line-and-column-number-from-the-cursor-position/4162
 * - Line: https://discuss.codemirror.net/t/get-current-line-number/4059/4
 * @param {EditorState} state
 * @returns {string}
 */
const createSelectText = (state: EditorState) => {
  const { doc, selection } = state

  const line = doc.lineAt(selection.main.head).number
  const column = selection.ranges[0].head - doc.lineAt(selection.main.head).from + 1

  return `Ln ${line}, Col ${column}`
}

/**
 * Creates an info panel
 *
 * Reference: https://codemirror.net/examples/panel/
 *
 * @param {EditorView} view
 * @returns {Panel}
 */
function wordCountPanel(view: EditorView): Panel {
  const dom = document.createElement('div')
  const left = document.createElement('div')
  const right = document.createElement('div')
  dom.append(left)
  dom.append(right)

  left.textContent = createText(view.state)
  right.textContent = createSelectText(view.state)

  return {
    dom,
    update(update) {
      if (!update.docChanged && !update.selectionSet) return
      const { state } = update

      // TODO: set cursor position in local storage

      left.textContent = createText(state)
      right.textContent = createSelectText(state)
    }
  }
}

export default wordCountPanel
