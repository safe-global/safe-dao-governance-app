import { useAddress } from './useAddress'
import { useChainId } from './useChainId'
import { useWeb3 } from './useWeb3'
import useSWR from 'swr'
import { fetchTokenBalance, fetchTokenLockingAllowance } from '@/utils/safe-token'
import { fetchLockedAmount, fetchUnlockData } from '@/utils/lock'
import { BigNumber } from 'ethers'
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

export const useSafeTokenLockingAllowance = () => {
  const QUERY_KEY = 'safe-token-locking-allowance'
  const web3 = useWeb3()
  const chainId = useChainId()
  const address = useAddress()

  return useSWR(web3 && address ? QUERY_KEY : null, () => {
    if (!address || !web3) {
      return '0'
    }
    return fetchTokenLockingAllowance(chainId, address, web3)
  })
}

export type SingleUnlock = {
  unlockAmount: BigNumber
  unlockedAt: BigNumber
  isUnlocked: boolean
}

export const useSafeTokenLockUserInfo = () => {
  const QUERY_KEY = 'safe-token-locked'
  const web3 = useWeb3()
  const chainId = useChainId()
  const address = useAddress()

  return useSWR(web3 && address ? QUERY_KEY : null, (): Promise<[BigNumber, BigNumber, number, number] | undefined> => {
    if (!address || !web3) {
      return Promise.resolve([BigNumber.from(0), BigNumber.from(0), 0, 0])
    }
    return fetchLockedAmount(chainId, address, web3)
  })
}
