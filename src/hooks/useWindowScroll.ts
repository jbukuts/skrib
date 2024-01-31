import { useState } from 'react'
import { useMount } from 'react-use'

export default function useWindowScroll() {
  const [scrollPosition, setScrollPosition] = useState(0)

  useMount(() => {
    const handleScroll = () => {
      const position = window.scrollY
      setScrollPosition(position)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  return scrollPosition
}
