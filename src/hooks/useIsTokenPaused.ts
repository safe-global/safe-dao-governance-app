import useSWR from 'swr'
import { SafeToken__factory } from '@/types/contracts/safe-token'
import type { JsonRpcProvider } from '@ethersproject/providers'

import { CHAIN_SAFE_TOKEN_ADDRESS } from '@/config/constants'
import { useWeb3 } from '@/hooks/useWeb3'
import { useWallet } from '@/hooks/useWallet'

/**
 * Fetches if the token is currently paused from on-chain.
 * If the fetching fails and initially we assume that the token is paused as the claimingViaModule should always work.
 */
export const _getIsTokenPaused = async (web3?: JsonRpcProvider): Promise<boolean | undefined> => {
  if (!web3) {
    return
  }

  const signer = web3.getSigner()
  const chainId = await signer.getChainId()

  const safeTokenAddress = CHAIN_SAFE_TOKEN_ADDRESS[chainId]

  if (!safeTokenAddress) {
    return
  }

  const safeTokenContract = SafeToken__factory.connect(safeTokenAddress, web3)

  let isPaused = true

  try {
    isPaused = await safeTokenContract.paused()
  } catch (err) {
    console.error(err)
  }

  return isPaused
}

export const useIsTokenPaused = () => {
  const QUERY_KEY = 'isTokenPaused'

  const web3 = useWeb3()
  const wallet = useWallet()

  return useSWR(web3 ? [QUERY_KEY, wallet?.chainId] : undefined, () => _getIsTokenPaused(web3))
}
