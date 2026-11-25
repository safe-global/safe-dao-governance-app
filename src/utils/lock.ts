import { CHAIN_SAFE_LOCKING_ADDRESS } from '@/config/constants'
import type { BigNumber } from 'ethers'
import type { JsonRpcProvider } from '@ethersproject/providers'
import { Interface } from 'ethers/lib/utils'

const safeLockingInterface = new Interface([
  'function unlock(uint96)',
  'function getUser(address)',
  'function getUserTokenBalance(address)',
  'function getUnlock(address,uint32)',
  'function withdraw(uint32)',
])

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
  }
}

/**
 * Returns total tokens in the locking contract including locked and unlocked amounts.
 *
 * @param chainId
 * @param safeAddress
 * @param provider
 * @returns total token balance
 */
export const fetchLockingContractBalance = async (chainId: string, safeAddress: string, provider: JsonRpcProvider) => {
  const lockingAddress = CHAIN_SAFE_LOCKING_ADDRESS[chainId]

  if (!lockingAddress) {
    return '0'
  }

  try {
    return await provider.call({
      to: lockingAddress,
      data: safeLockingInterface.encodeFunctionData('getUserTokenBalance', [safeAddress]),
    })
  } catch (err) {
    throw Error(`Error fetching Safe Token balance in locking contract:  ${err}`)
  }
}
