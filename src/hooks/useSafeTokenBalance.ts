import { useAddress } from './useAddress'
import { useChainId } from './useChainId'
import { useWeb3 } from './useWeb3'
import useSWR from 'swr'
import { fetchTokenBalance } from '@/utils/safe-token'
import { POLLING_INTERVAL } from '@/config/constants'

export const useSafeTokenBalance = () => {
  const QUERY_KEY = 'safe-token-balance'
  const web3 = useWeb3()
  const chainId = useChainId()
  const address = useAddress()

  return useSWR(
    web3 && address ? QUERY_KEY : null,
    () => {
      if (!address || !web3) {
        return '0'
      }
      return fetchTokenBalance(chainId, address, web3)
    },
    {
      refreshInterval: POLLING_INTERVAL,
    },
  )
}
