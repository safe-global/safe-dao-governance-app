import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

import { useWallet } from '@/hooks/useWallet'

export const useAddress = (): string | undefined => {
  const { safe } = useSafeAppsSDK()
  const wallet = useWallet()

  // If using as Safe App, return Safe address, otherwise return wallet address
  return safe.safeAddress || wallet?.address
}
