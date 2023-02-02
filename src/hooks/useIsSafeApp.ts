import { useState } from 'react'

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

export const useIsSafeApp = (): boolean => {
  const [isSafeApp, setIsSafeApp] = useState(false)

  useIsomorphicLayoutEffect(() => {
    const isIframe = typeof window !== 'undefined' && window.self !== window.top
    setIsSafeApp(isIframe)
  }, [setIsSafeApp])

  return isSafeApp
}
