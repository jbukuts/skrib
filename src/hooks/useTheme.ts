import { useEffect } from 'react'
import { useUserSettings } from '.'

export default function useTheme() {
  const { theme } = useUserSettings()

  // ensure theme changes on html element
  useEffect(() => {
    const html: HTMLElement = document.getElementsByTagName('html')[0]
    html.setAttribute('data-theme', theme)

    // TODO: Bad way to do this dont like it
    html.style.colorScheme = theme

    const metaElement = document.querySelectorAll('meta[name="theme-color"]')
    if (metaElement.length > 0) {
      const themeColor = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-background'
      )
      metaElement[0].setAttribute('content', `rgb(${themeColor})`)
    }
  }, [theme])
}
