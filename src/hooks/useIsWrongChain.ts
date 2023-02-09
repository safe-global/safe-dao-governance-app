import { useIsSafeApp } from '@/hooks/useIsSafeApp'
import { useWallet } from '@/hooks/useWallet'
import { useDefaultChainId } from './useDefaultChainId'

export const useIsWrongChain = (): boolean => {
  const isSafeApp = useIsSafeApp()
  const wallet = useWallet()
  const defaultChainId = useDefaultChainId()

  if (isSafeApp || !wallet) {
    return false
  }

  return wallet.chainId !== defaultChainId.toString()
}
