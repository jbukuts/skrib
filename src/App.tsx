import { useDebounce, useLocalStorage } from '@uidotdev/usehooks'
import { Suspense, lazy, useCallback, useEffect } from 'react'
import { useDeepCompareEffect, useMount } from 'react-use'
import { useShallow } from 'zustand/react/shallow'
import { CodeMirrorEditor, KeyCommands, TopBar } from '@/components'
import { DEF_TEXT } from '@/constants'
import useEditorStateStore from '@/store/editor-state'
import useSettingsStore, { DEF_SETTINGS, SettingsState } from '@/store/settings'
import '#styles/App.scss'
import '#styles/themes/ascetic.css'
import FileViewer from './components/FileViewer/FileViewer'
import { Stack } from './components/UI/Layout'
import { useFileSystem } from './hooks'

const Settings = lazy(() => import('@/components/Settings'))
const NewModal = lazy(() => import('@/components/UI/NewModal'))
const Preview = lazy(() => import('@/components/Preview'))
const FirstTime = lazy(() => import('@/components/FirstTime'))

function App() {
  // persistent user settings
  const { settings, setArbitrary } = useSettingsStore(
    useShallow((s) => ({
      settings: {
        fontFace: s.fontFace,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        showLineCount: s.showLineCount,
        showInfoPanel: s.showInfoPanel,
        variableHeadings: s.variableHeadings,
        theme: s.theme,
        smoothCursorBlink: s.smoothCursorBlink,
        smoothCursorMove: s.smoothCursorMove
      } as SettingsState,
      setArbitrary: s.setArbitrary
    }))
  )

  // transient editor state
  const { showSettings, showPreview, setArbitraryEditorState } = useEditorStateStore(
    useShallow((s) => ({
      showSettings: s.showSettings,
      setArbitraryEditorState: s.setArbitrary,
      showPreview: s.showPreview
    }))
  )

  // handle scroll sync
  // const [{ y }] = useWindowScroll()
  // const [scrollPerc, setScrollPerc] = useState<number>(0)

  // useEffect(() => {
  //   const d = document.documentElement
  //   const per = (y as number) / (d.scrollHeight - d.clientHeight)
  //   setScrollPerc(per)
  //   console.log(y, per)
  // }, [y])

  // useEffect(() => {
  //   console.log('match scroll', scrollPerc)
  //   setTimeout(() => {
  //     const docHeight = document.documentElement.scrollHeight
  //     window.scrollTo(0, docHeight * scrollPerc)
  //   }, 1)
  // }, [showPreview])

  // initialize from local storage or set as default
  const [localSettings, setLocalSettings] = useLocalStorage<SettingsState>('settings', DEF_SETTINGS)
  const [localText, setLocalText] = useLocalStorage<string>('file', DEF_TEXT)
  const [firstVisit, setFirstVisit] = useLocalStorage<boolean>('firsttime', true)
  const [currentFile, setCurrentFile] = useLocalStorage<string>('current_file')

  const { getFileText, isReady, fileList, createFile, writeToFile } = useFileSystem()
  const debounceText = useDebounce(localText, 500)

  const handleTextChange = useCallback((s: string) => {
    setLocalText(s)
  }, [])

  // save file automatically
  useEffect(() => {
    if (!currentFile) return
    const saveFile = async () => {
      await writeToFile(currentFile, localText)
      console.log('saved file!')
    }

    saveFile()
  }, [debounceText])

  // handle file changes
  useEffect(() => {
    console.log(currentFile)
    getFileText(currentFile).then((t) => {
      if (t === undefined) return
      setLocalText(t)
    })
  }, [currentFile])

  // handle initializing starting file
  useEffect(() => {
    if (!isReady || fileList.length > 0) return

    const createStartingFile = async () => {
      const startingFile = 'welcome'
      console.info('Creating starting file!')
      await createFile(startingFile)
      await writeToFile(startingFile, localText)
      setCurrentFile(startingFile)
    }

    createStartingFile()
  }, [fileList, isReady])

  // ensure theme changes on html element
  useEffect(() => {
    const html: HTMLElement = document.getElementsByTagName('html')[0]
    html.setAttribute('data-theme', settings.theme)

    const metaElement = document.querySelectorAll('meta[name="theme-color"]')
    if (metaElement.length > 0) {
      const themeColor = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-background'
      )
      metaElement[0].setAttribute('content', `rgb(${themeColor})`)
    }
  }, [settings.theme])

  // on mount change store settings to match local storage
  useMount(() => {
    console.log('theme from localstorage', localSettings.theme)
    setArbitrary(localSettings)
  })

  // update settings in local storage
  useDeepCompareEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  return (
    <>
      <TopBar />
      <Stack spacing='none' style={{ width: '100vw', flex: '1' }}>
        <FileViewer></FileViewer>
        <CodeMirrorEditor
          className={showPreview ? 'hide-me' : ''}
          code={localText}
          onChange={handleTextChange}
          lineNumbers={settings.showLineCount}
          lineHeight={settings.lineHeight}
          fontSize={settings.fontSize}
          fontFamily={settings.fontFace}
          showInfoPanel={settings.showInfoPanel}
          variableHeadingSize={settings.variableHeadings}
          smoothCursorBlink={settings.smoothCursorBlink}
          smoothCursorMove={settings.smoothCursorMove}
        />
        <Suspense fallback={null}>
          <Preview
            className={!showPreview ? 'hide-me' : ''}
            fontSize={settings.fontSize}
            rawText={localText}></Preview>
        </Suspense>
      </Stack>

      <Suspense fallback={null}>
        <NewModal
          title='Settings'
          open={showSettings}
          onClose={() => setArbitraryEditorState({ showSettings: false })}>
          <Settings />
        </NewModal>
      </Suspense>
      {firstVisit && (
        <Suspense fallback={null}>
          <NewModal
            title='Welcome to skrib!'
            open={firstVisit}
            onClose={() => setFirstVisit(false)}>
            <FirstTime />
          </NewModal>
        </Suspense>
      )}
      <KeyCommands />
    </>
  )
}

export default App
