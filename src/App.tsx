import { useDebounce, useLocalStorage } from '@uidotdev/usehooks'
import { Suspense, lazy, useCallback, useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { CodeMirrorEditor, KeyCommands, TopBar } from '@/components'
import FileViewer from '@/components/FileViewer/FileViewer'
import { Stack } from '@/components/UI/Layout'
import { DEF_TEXT } from '@/constants'
import { useFileSystem, useUserSettings } from '@/hooks'
import useEditorStateStore from '@/store/editor-state'
import '#styles/App.scss'
import '#styles/themes/ascetic.css'
import useTheme from './hooks/useTheme'

const Settings = lazy(() => import('@/components/Settings'))
const NewModal = lazy(() => import('@/components/UI/NewModal'))
const Preview = lazy(() => import('@/components/Preview'))
const FirstTime = lazy(() => import('@/components/FirstTime'))

function App() {
  // transient editor state
  const { showSettings, showPreview, fileView, setArbitraryEditorState } = useEditorStateStore(
    useShallow((s) => ({
      showSettings: s.showSettings,
      setArbitraryEditorState: s.setArbitrary,
      showPreview: s.showPreview,
      fileView: s.fileView
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
  const {
    showInfoPanel,
    showLineCount,
    fontSize,
    fontFace,
    variableHeadings,
    smoothCursorMove,
    smoothCursorBlink,
    lineHeight
  } = useUserSettings()

  // handle theme changes
  useTheme()

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

  return (
    <>
      <TopBar />
      <Stack spacing='none' style={{ width: '100vw', flex: '1' }}>
        {fileView && <FileViewer />}
        <CodeMirrorEditor
          className={showPreview ? 'hide-me' : ''}
          code={localText}
          onChange={handleTextChange}
          lineNumbers={showLineCount}
          lineHeight={lineHeight}
          fontSize={fontSize}
          fontFamily={fontFace}
          showInfoPanel={showInfoPanel}
          variableHeadingSize={variableHeadings}
          smoothCursorBlink={smoothCursorBlink}
          smoothCursorMove={smoothCursorMove}
        />
        <Suspense fallback={null}>
          <Preview
            className={!showPreview ? 'hide-me' : ''}
            fontSize={fontSize}
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
