import { useIsSafeApp } from '@/hooks/useIsSafeApp'
import { useWallet } from '@/hooks/useWallet'
import { useChainId } from './useChainId'

export const useIsWrongChain = (): boolean => {
  const isSafeApp = useIsSafeApp()
  const wallet = useWallet()
  const chainId = useChainId()

  if (isSafeApp || !wallet) {
    return false
  }

  return wallet.chainId !== chainId
}
