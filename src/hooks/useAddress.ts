import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

import { useWallet } from '@/hooks/useWallet'

export const useAddress = (): string | undefined => {
  const { safe } = useSafeAppsSDK()
  const wallet = useWallet()

  return safe.safeAddress || wallet?.address
}
