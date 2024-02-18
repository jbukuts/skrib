/**
 * helper to create array of numbers in range
 * @param start start number
 * @param length how long to run
 * @returns {number[]}
 */
export const createRangeArr = (start: number, length: number) =>
  Array.from({ length }, (_, i) => i + start)

/**
 * helper to clamp number within range
 * @param v value to clamp against
 * @param min min value in range
 * @param max max value in range
 * @returns {number} number within specified range
 */
export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

/**
 * helper to split path string into array
 * @param p path string delimited by forward slash
 * @returns {string[]}
 */
export const splitPath = (p: string) => p.split('/').filter((i) => !!i)

/**
 * helper to return inline css property for theme color
 * @param name color name
 * @param opacity desired opacity of color
 * @returns {string} string of css property
 */
export const getColor = (name: string, opacity: number = 1) =>
  `rgba(var(--color-${name}), ${opacity})`

/**
 * helper to mix theme colors
 * @param colorOne first color to mix from theme colors
 * @param colorTwo second color to mix from theme colors
 * @param p1 percentage to apply to mix for first color
 * @param p2 percentage to apply to mix for second color
 * @returns {string} mixed color css propery
 */
export const mixColors = (colorOne: string, colorTwo: string, p1: number = 50, p2: number = 50) => {
  return `color-mix(in srgb, ${getColor(colorOne)} ${p1}%, ${getColor(colorTwo)} ${p2}%)`
}

export const getCSSProperty = (prop: string) => {
  const doc = document.documentElement
  return getComputedStyle(doc).getPropertyValue(prop)
}
