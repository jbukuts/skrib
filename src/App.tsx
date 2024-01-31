import { useLocalStorage } from '@uidotdev/usehooks'
import { Suspense, lazy, useCallback, useEffect } from 'react'
import { useDeepCompareEffect, useMount } from 'react-use'
import { useShallow } from 'zustand/react/shallow'
import { CodeMirrorEditor, KeyCommands, TopBar } from '@/components'
import Settings from '@/components/Settings'
import { NewModal } from '@/components/UI'
import useEditorStateStore from './store/editor-state'
import useSettingsStore, { DEF_SETTINGS, SettingsState } from './store/settings'
import '#styles/App.scss'
import '#styles/themes/ascetic.css'

const Preview = lazy(() => import('@/components/Preview'))
const FirstTime = lazy(() => import('@/components/FirstTime'))

const DEF_TEXT = `
# Lorem ipsum

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lobortis vitae justo id dapibus. 
Vivamus varius ut turpis a lobortis. Sed cursus consectetur elementum. Aliquam consequat nec mauris a placerat. 
Curabitur sagittis erat sed tellus fermentum consectetur. 
Vestibulum dapibus nulla a leo ornare, vel convallis tortor sagittis. 

## Vivamus varius

Vivamus varius hendrerit massa et **_fringilla_**.
In tempor varius eros, at feugiat felis mattis eu. 
Ut consequat malesuada arcu sed laoreet. Mauris porta pretium lacus, in egestas eros lobortis vel. 
Suspendisse quis nisi dictum, tincidunt nisi quis, posuere orci.

Suspendisse **ante** risus, semper quis commodo eleifend, lobortis id diam. 
Curabitur id auctor augue. Donec risus nisi, vulputate in tellus nec, iaculis vestibulum velit.
Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. 
In eleifend ligula non ligula iaculis, sed congue lorem suscipit. 

- Integer convallis molestie iaculis. 
- Fusce felis mauris, imperdiet in porta eu, viverra vel nibh. 
- Praesent suscipit sed eros et feugiat. 

> Aliquam nec ornare lacus. Nam id pharetra nibh, sed tincidunt ex.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lobortis vitae justo id dapibus. 
Vivamus varius ut turpis a lobortis. Sed cursus consectetur elementum. Aliquam consequat nec mauris a placerat. 
Curabitur sagittis erat sed tellus fermentum consectetur. 
Vestibulum dapibus nulla a leo ornare, vel convallis tortor sagittis. 
`.trim()

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
        theme: s.theme
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

  const handleTextChange = useCallback((s: string) => {
    setLocalText(s)
  }, [])

  // ensure theme changes on html element
  useEffect(() => {
    const html: HTMLElement = document.getElementsByTagName('html')[0]
    html.setAttribute('data-theme', settings.theme)

    // TODO: Bad way to do this dont like it
    html.style.colorScheme = settings.theme
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
      />
      <Suspense fallback={null}>
        <Preview
          className={!showPreview ? 'hide-me' : ''}
          fontSize={settings.fontSize}
          rawText={localText}></Preview>
      </Suspense>
      {firstVisit && (
        <Suspense fallback={null}>
          <NewModal
            title='Welcome to skrib!'
            open={firstVisit}
            onClose={() => setFirstVisit(false)}>
            <FirstTime></FirstTime>
          </NewModal>
        </Suspense>
      )}
      <NewModal
        title='Settings'
        open={showSettings}
        onClose={() => setArbitraryEditorState({ showSettings: false })}>
        <Settings />
      </NewModal>
      <KeyCommands></KeyCommands>
    </>
  )
}

export default App
