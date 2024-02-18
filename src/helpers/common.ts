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
