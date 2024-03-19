import { useAddress } from './useAddress'
import { useChainId } from './useChainId'
import { useWeb3 } from './useWeb3'
import useSWR from 'swr'
import { fetchTokenBalance, fetchTokenLockingAllowance } from '@/utils/safe-token'
import { fetchLockedAmount, fetchUnlockData } from '@/utils/lock'
import { BigNumber } from 'ethers'

export const useSafeTokenBalance = () => {
  const QUERY_KEY = 'safe-token-balance'
  const web3 = useWeb3()
  const chainId = useChainId()
  const address = useAddress()

  return useSWR(web3 ? QUERY_KEY : null, () => {
    if (!address || !web3) {
      return '0'
    }
    return fetchTokenBalance(chainId, address, web3)
  })
}

export const useSafeTokenLockingAllowance = () => {
  const QUERY_KEY = 'safe-token-locking-allowance'
  const web3 = useWeb3()
  const chainId = useChainId()
  const address = useAddress()

  return useSWR(web3 ? QUERY_KEY : null, () => {
    if (!address || !web3) {
      return '0'
    }
    return fetchTokenLockingAllowance(chainId, address, web3)
  })
}

type UserLockingInfos = {
  nextUnlock: SingleUnlock | undefined
  totalUnlockedAmount: BigNumber
  lockedAmount: BigNumber
}

export type SingleUnlock = {
  unlockAmount: BigNumber
  unlockedAt: BigNumber
  isUnlocked: boolean
}

export const useSafeUserLockingInfos = () => {
  const { data: userInfo } = useSafeTokenLockUserInfo()
  const web3 = useWeb3()
  const chainId = useChainId()
  const address = useAddress()

  return useSWR(
    userInfo,
    async (userInfo: [BigNumber, BigNumber, number, number] | undefined): Promise<UserLockingInfos | undefined> => {
      if (!address || !web3) {
        return undefined
      }
      const currentlyLocked = userInfo?.[0] ?? BigNumber.from(0)
      const unlockedTotal = userInfo?.[1] ?? BigNumber.from(0)
      const lockStartIdx = userInfo?.[2] ?? 0
      const lockEndIdx = userInfo?.[3] ?? 0

      let nextUnlock: SingleUnlock | undefined = undefined

      if (unlockedTotal.gt(0) && lockEndIdx > lockStartIdx) {
        // There is only a single unlock event
        const [unlockAmount, unlockedAt] = (await fetchUnlockData(chainId, address, lockStartIdx, web3)) ?? [
          BigNumber.from(0),
          BigNumber.from(0),
        ]

        nextUnlock = {
          unlockAmount,
          unlockedAt,
          isUnlocked: unlockedAt.mul(1000).lte(Date.now()),
        }
      }

      return {
        nextUnlock,
        totalUnlockedAmount: unlockedTotal,
        lockedAmount: currentlyLocked,
      }
    },
  )
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
