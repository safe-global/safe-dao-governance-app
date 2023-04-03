import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

import { useIsSafeApp } from '@/hooks/useIsSafeApp'
import { useWallet } from '@/hooks/useWallet'

export const useAddress = (): string | undefined => {
  const isSafeApp = useIsSafeApp()
  const { safe } = useSafeAppsSDK()
  const wallet = useWallet()

  if (isSafeApp) {
    return safe.safeAddress
  }

  return wallet?.address
}
