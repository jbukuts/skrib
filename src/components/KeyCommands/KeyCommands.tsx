import keyboardJs from 'keyboardjs'
import { useShallow } from 'zustand/react/shallow'
import { useKeyboardJsToggle } from '@/hooks'
import useEditorStateStore from '@/store/editor-state'
import useSettingsStore from '@/store/settings'

const handleSaveFile: keyboardJs.Callback = async (e) => {
  if (!e) return
  e.preventDefault()
  // TODO: Save file logic if file picker not available
  console.log('saving file')

  const today = new Date().toDateString().replace(/\s/gi, '-')
  const fileName = `${today}_skrib.md`
  const fileString = JSON.parse(localStorage.getItem('file') || '')
  if (!fileString) return

  const blob = new Blob([fileString], { type: 'text/markdown', endings: 'native' })

  if (!('showSaveFilePicker' in window)) {
    console.warn('showSaveFilePicker not available. Saving to download folder instead.')
    return
  }

  const filePickOpts: SaveFilePickerOptions = {
    suggestedName: fileName,
    startIn: 'documents',
    excludeAcceptAllOption: true,
    types: [
      {
        description: 'Markdown file',
        accept: { 'text/markdown': ['.md'] }
      }
    ]
  }

  const handle = await window.showSaveFilePicker(filePickOpts)
  const ws = await handle.createWritable()
  await ws.write(blob)
  await ws.close()
}

export default function KeyCommands() {
  const { toggleSettings, togglePreview, toggleFileView } = useEditorStateStore(
    useShallow((s) => ({
      toggleSettings: s.toggleSettings,
      togglePreview: s.togglePreview,
      toggleFileView: s.toggleFileView
    }))
  )

  const { toggleLineNumbers } = useSettingsStore(
    useShallow((s) => ({
      toggleLineNumbers: s.toggleLineCount
    }))
  )

  // define keybind actions
  useKeyboardJsToggle('ctrl + b', toggleFileView)
  useKeyboardJsToggle('ctrl + d', (e) => {
    e?.preventDefault()
    togglePreview()
  })
  useKeyboardJsToggle('ctrl + m', toggleSettings)
  useKeyboardJsToggle('ctrl + l', (e) => {
    e?.preventDefault()
    toggleLineNumbers()
  })
  useKeyboardJsToggle('ctrl + s', handleSaveFile)

  return <></>
}
