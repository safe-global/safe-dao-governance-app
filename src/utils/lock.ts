import { CHAIN_SAFE_LOCKING_ADDRESS } from '@/config/constants'
import { BigNumber } from 'ethers'
import type { JsonRpcProvider } from '@ethersproject/providers'
import { formatUnits, Interface } from 'ethers/lib/utils'
import { LockingHistoryEntry, UnlockEvent, useLockHistory, WithdrawEvent } from '@/hooks/useLockHistory'
import { toDaysSinceStart } from './date'

const safeLockingInterface = new Interface([
  'function lock(uint96)',
  'function unlock(uint96)',
  'function getUser(address)',
  'function getUserTokenBalance(address)',
  'function getUnlock(address,uint32)',
  'function withdraw(uint32)',
])

export const isUnlockEvent = (event: LockingHistoryEntry): event is UnlockEvent => event.eventType === 'UNLOCKED'
export const isWithdrawEvent = (event: LockingHistoryEntry): event is WithdrawEvent => event.eventType === 'WITHDRAWN'

export type LockHistory = {
  day: number
  // can be negative for unlocks
  amount: number
}

/**
 * Return the relative lock history sorted by execution time
 *
 * @param data lockHistory
 * @param startTime startTime as timestamp
 * @returns sorted history of lock amount differences
 */
export const toRelativeLockHistory = (data: ReturnType<typeof useLockHistory>, startTime: number): LockHistory[] => {
  const sortedHistory = [...data].sort((d1, d2) => Date.parse(d1.executionDate) - Date.parse(d2.executionDate))
  return sortedHistory
    .filter((entry) => entry.eventType !== 'WITHDRAWN')
    .map((entry) => ({
      day: toDaysSinceStart(Date.parse(entry.executionDate), startTime),
      amount: Number(formatUnits(BigNumber.from(entry.amount), 18)) * (entry.eventType === 'LOCKED' ? 1 : -1),
    }))
}

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
