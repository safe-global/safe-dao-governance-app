import useSWR from 'swr'
import { BigNumber } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import type { JsonRpcProvider } from '@ethersproject/providers'

import { CHAIN_SAFE_LOCKING_ADDRESS, MULTICALL3_ADDRESS, POLLING_INTERVAL } from '@/config/constants'
import { useWeb3 } from './useWeb3'
import { useAddress } from './useAddress'
import { useChainId } from './useChainId'

export const lockInterface = new Interface([
  'function getUser(address) view returns (tuple(uint96 locked, uint96 unlocked, uint32 unlockStart, uint32 unlockEnd))',
  'function getUnlock(address, uint32) view returns (tuple(uint96 amount, uint64 maturesAt))',
])

export const multicallInterface = new Interface([
  'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[] returnData)',
])

export type PendingUnlock = {
  index: number
  amount: BigNumber
  maturesAt: number // in seconds
}

export type LockState = {
  locked: BigNumber
  unlocked: BigNumber // unlocked, not yet withdrawn (matured or not)
  withdrawable: BigNumber // matured, can be withdrawn now
  pendingUnlocks: PendingUnlock[] // not matured yet, sorted by index
}

/**
 * Reads the lock position of `holder` straight from the SafeTokenLock contract.
 * Two `eth_call`s at most: `getUser` for the unlock range, then every `getUnlock` batched in one Multicall3 call.
 */
export const _fetchLockState = async (
  provider: JsonRpcProvider,
  lockAddress: string,
  holder: string,
): Promise<LockState> => {
  const userResult = await provider.call({
    to: lockAddress,
    data: lockInterface.encodeFunctionData('getUser', [holder]),
  })
  const user = lockInterface.decodeFunctionResult('getUser', userResult)[0]
  const unlockStart = Number(user.unlockStart)
  const unlockEnd = Number(user.unlockEnd)

  const unlockIndices = Array.from(
    { length: Math.max(0, unlockEnd - unlockStart) },
    (_, offset) => unlockStart + offset,
  )

  let unlocks: PendingUnlock[] = []

  if (unlockIndices.length > 0) {
    const calls = unlockIndices.map((index) => ({
      target: lockAddress,
      allowFailure: false,
      callData: lockInterface.encodeFunctionData('getUnlock', [holder, index]),
    }))
    const multicallResult = await provider.call({
      to: MULTICALL3_ADDRESS,
      data: multicallInterface.encodeFunctionData('aggregate3', [calls]),
    })
    const [results] = multicallInterface.decodeFunctionResult('aggregate3', multicallResult)

    unlocks = unlockIndices.map((index, i) => {
      const unlock = lockInterface.decodeFunctionResult('getUnlock', results[i].returnData)[0]
      return { index, amount: BigNumber.from(unlock.amount), maturesAt: BigNumber.from(unlock.maturesAt).toNumber() }
    })
  }

  const now = Math.floor(Date.now() / 1000)

  return {
    locked: BigNumber.from(user.locked),
    unlocked: BigNumber.from(user.unlocked),
    withdrawable: unlocks
      .filter((unlock) => unlock.maturesAt <= now)
      .reduce((sum, unlock) => sum.add(unlock.amount), BigNumber.from(0)),
    pendingUnlocks: unlocks.filter((unlock) => unlock.maturesAt > now),
  }
}

export const useLockState = () => {
  const web3 = useWeb3()
  const chainId = useChainId()
  const address = useAddress()
  const lockAddress = CHAIN_SAFE_LOCKING_ADDRESS[chainId]

  return useSWR<LockState>(
    web3 && address && lockAddress ? ['lock-state', chainId, address] : null,
    () => _fetchLockState(web3!, lockAddress, address!),
    { refreshInterval: POLLING_INTERVAL },
  )
}
