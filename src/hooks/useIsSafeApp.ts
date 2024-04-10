import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

let isSafeApp = false

export const useIsSafeApp = (): boolean => {
  useIsomorphicLayoutEffect(() => {
    isSafeApp = typeof window !== 'undefined' && window.self !== window.top
  }, [isSafeApp])

  return isSafeApp
}
