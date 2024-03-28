import { useEffect, useState } from 'react'

export const useDebounce = <T>(value: T, timeout: number, initialValue: T) => {
  const [result, setResult] = useState<T>(initialValue)

  useEffect(() => {
    const update = (value: T) => {
      setResult(value)
    }

    const updateTimeout = setTimeout(() => update(value), timeout)
    return () => clearTimeout(updateTimeout)
  }, [value, timeout])

  return result
}
