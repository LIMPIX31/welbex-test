import { useMemo } from 'react'

export const useDestruct = <T>(value: T) => {
  return useMemo(() => value, [value])
}
