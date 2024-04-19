import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { useEffect, useState } from 'react'

export const useIsSafeApp = (): boolean => {
  const { connected } = useSafeAppsSDK()
  const [isSafeApp, setIsSafeApp] = useState(connected)

  useEffect(() => {
    const isApp = connected || (typeof window !== 'undefined' && window.self !== window.top)
    setIsSafeApp(isApp)
  }, [connected])
  return isSafeApp
}
