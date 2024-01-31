export const createRangeArr = (start: number, length: number) =>
  Array.from({ length }, (_, i) => i + start)

export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
