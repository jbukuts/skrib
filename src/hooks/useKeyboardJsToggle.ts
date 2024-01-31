import keyboardjs from 'keyboardjs'
import { useEffect } from 'react'

export default function useKeyboardJsToggle(
  combination: string | string[],
  call: keyboardjs.Callback
) {
  useEffect(() => {
    const up = () => null
    keyboardjs.bind(combination, call, up, true)

    return () => {
      keyboardjs.unbind(combination, call, up)
    }
  }, [combination, call])
}
