import { interpolateAll, splitPathString } from 'flubber'
import { FaAlignLeft, FaCode } from 'react-icons/fa6'
import { LuAlignLeft } from 'react-icons/lu'
import { RxTextAlignLeft } from 'react-icons/rx'

export default function MorphSwitch() {
  // access path
  const a = FaCode({}).props.children[0].props['d']
  const b = FaAlignLeft({}).props.children[0].props['d']

  console.log(FaAlignLeft({}).props)

  const x = splitPathString(a)
  const y = splitPathString(b).slice(0, 3)

  console.log(x.length, y.length)

  const interpolator = interpolateAll(x, y)

  console.log(interpolator)

  return (
    <svg width='250' height='250' viewBox='0 0 500 500'>
      {interpolator.map((i) => {
        return <path d={i(1)} fill={'WHITE'} />
      })}
    </svg>
  )
}
