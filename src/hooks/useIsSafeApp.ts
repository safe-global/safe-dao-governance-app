import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'

export const useIsSafeApp = (): boolean => {
  const { connected } = useSafeAppsSDK()
  return connected
}
