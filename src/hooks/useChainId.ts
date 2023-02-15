import { ExternalStore } from '@/services/ExternalStore'
import { Chains, IS_PRODUCTION, _DEFAULT_CHAIN_ID } from '@/config/constants'
import { useIsSafeApp } from '@/hooks/useIsSafeApp'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

export const chainIdStore = new ExternalStore(_DEFAULT_CHAIN_ID)

const supportedChains = Object.values(Chains)

export const useChainId = () => {
  const isSafeApp = useIsSafeApp()
  const { safe } = useSafeAppsSDK()

  if (IS_PRODUCTION) {
    return _DEFAULT_CHAIN_ID
  }

  if (isSafeApp && supportedChains.includes(safe.chainId)) {
    return safe.chainId
  }

  return chainIdStore.useStore()!
}
