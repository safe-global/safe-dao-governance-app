import { useEffect, useState } from 'react'

export const useIsSafeApp = (): boolean => {
  const [isSafeApp, setIsSafeApp] = useState(false)

  useEffect(() => {
    const isApp = typeof window !== 'undefined' && window.self !== window.top
    setIsSafeApp(isApp)
  }, [])
  return isSafeApp
}
