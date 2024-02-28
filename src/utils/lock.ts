import { CHAIN_SAFE_LOCKING_ADDRESS } from '@/config/constants'
import { BigNumber, Contract } from 'ethers'
import type { JsonRpcProvider } from '@ethersproject/providers'
import { defaultAbiCoder, Interface } from 'ethers/lib/utils'

const safeLockingInterface = new Interface([
  'function lock(uint96)',
  'function unlock(uint96)',
  'function getUser(address)',
  'function getUnlock(address,uint32)',
  'function withdraw(uint32)',
])

export const createLockTx = (chainId: string, amount: BigNumber) => {
  return {
    to: CHAIN_SAFE_LOCKING_ADDRESS[chainId],
    data: safeLockingInterface.encodeFunctionData('lock', [amount]),
    value: '0',
    operation: 0,
  }
}

export const createUnlockTx = (chainId: string, amount: BigNumber) => {
  return {
    to: CHAIN_SAFE_LOCKING_ADDRESS[chainId],
    data: safeLockingInterface.encodeFunctionData('unlock', [amount]),
    value: '0',
    operation: 0,
  }
}

/**
 * Calls the `withdraw` function with 0 `maxUnlocks`.
 * This will withdraw all available unlocks.
 */
export const createWithdrawTx = (chainId: string) => {
  return {
    to: CHAIN_SAFE_LOCKING_ADDRESS[chainId],
    data: safeLockingInterface.encodeFunctionData('withdraw', [0]),
    value: '0',
    operation: 0,
  }
}

export const fetchLockedAmount = async (chainId: string, safeAddress: string, provider: JsonRpcProvider) => {
  const lockingAddress = CHAIN_SAFE_LOCKING_ADDRESS[chainId]
  const result = await provider.call({
    to: lockingAddress,
    data: safeLockingInterface.encodeFunctionData('getUser', [safeAddress]),
  })

  const decodedResult = defaultAbiCoder.decode(['uint96', 'uint96', 'uint32', 'uint32'], result)
  if (Array.isArray(decodedResult)) {
    return decodedResult as [BigNumber, BigNumber, number, number]
  }
}

/**
 * Receives the data for a specific Unlock.
 *
 * @param index index of the unlock
 * @returns Unlock data for index: [amount, unlockedAt (in seconds)] or undefined
 */
export const fetchUnlockData = async (
  chainId: string,
  safeAddress: string,
  index: number,
  provider: JsonRpcProvider,
): Promise<[BigNumber, BigNumber] | undefined> => {
  const lockingAddress = CHAIN_SAFE_LOCKING_ADDRESS[chainId]
  const result = await provider.call({
    to: lockingAddress,
    data: safeLockingInterface.encodeFunctionData('getUnlock', [safeAddress, index]),
  })
  const decodedResult = defaultAbiCoder.decode(['uint96', 'uint64'], result)

  if (Array.isArray(decodedResult)) {
    return decodedResult as [BigNumber, BigNumber]
  }
}
