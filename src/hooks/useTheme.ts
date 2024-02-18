import { useEffect } from 'react'
import { getCSSProperty } from '@/helpers/common'
import { useUserSettings } from '.'

export default function useTheme() {
  const { theme } = useUserSettings()

  // ensure theme changes on html element
  useEffect(() => {
    const html: HTMLElement = document.getElementsByTagName('html')[0]
    html.setAttribute('data-theme', theme)
    html.style.colorScheme = getCSSProperty('--color-scheme')

    const metaElement = document.querySelectorAll('meta[name="theme-color"]')
    if (metaElement.length > 0) {
      const themeColor = getCSSProperty('--color-background')
      metaElement[0].setAttribute('content', `rgb(${themeColor})`)
    }
  }, [theme])
}
