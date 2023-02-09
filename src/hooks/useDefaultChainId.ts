import { ExternalStore } from '@/services/ExternalStore'
import { IS_PRODUCTION, _DEFAULT_CHAIN_ID } from '@/config/constants'

export const defaultChainIdStore = new ExternalStore(_DEFAULT_CHAIN_ID)

export const useDefaultChainId = () => {
  return IS_PRODUCTION ? _DEFAULT_CHAIN_ID : defaultChainIdStore.useStore()!
}
