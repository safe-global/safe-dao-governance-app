import { getSafeInfo } from '@safe-global/safe-gateway-typescript-sdk'

import type { ConnectedWallet } from '@/hooks/useWallet'

export const isSafe = async (wallet: ConnectedWallet): Promise<boolean | null> => {
  try {
    return !!(await getSafeInfo(wallet.chainId, wallet.address))
  } catch {
    return false
  }
}
