import { isGreater24HoursDiff } from '@/utils/date'
import { isUnlockEvent, isWithdrawEvent } from '@/utils/lock'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { UnlockEvent, useLockHistory, WithdrawEvent } from './useLockHistory'

export const useSummarizedLockHistory = (
  lockHistory: ReturnType<typeof useLockHistory>,
): {
  totalLocked: BigNumber
  totalUnlocked: BigNumber
  totalWithdrawable: BigNumber
  nextUnlock: UnlockEvent | undefined
} => {
  const totalLocked = useMemo(
    () =>
      lockHistory.reduce((prev, event) => {
        switch (event.eventType) {
          case 'LOCKED':
            return prev.add(event.amount)

          case 'UNLOCKED':
            return prev.sub(event.amount)

          case 'WITHDRAWN':
            return prev
        }
      }, BigNumber.from(0)),
    [lockHistory],
  )
  const totalUnlocked = useMemo(
    () =>
      lockHistory.reduce((prev, event) => {
        switch (event.eventType) {
          case 'LOCKED':
            return prev
          case 'UNLOCKED':
            return prev.add(event.amount)
          case 'WITHDRAWN':
            return prev.sub(event.amount)
        }
      }, BigNumber.from(0)),
    [lockHistory],
  )
  const { totalWithdrawable, nextUnlock } = useMemo(() => {
    const unlocks = lockHistory.filter((event) => isUnlockEvent(event)).map((event) => event as UnlockEvent)
    const withdrawnIds = lockHistory
      .filter((event) => isWithdrawEvent(event))
      .map((event) => event as WithdrawEvent)
      .map((withdraw) => withdraw.unlockIndex)
    // Unlocks that have not been withdrawn and are older than 24h
    const withdrawableUnlocks = unlocks.filter(
      (unlock) =>
        !withdrawnIds.includes(unlock.unlockIndex) &&
        isGreater24HoursDiff(Date.parse(unlock.executionDate), Date.now()),
    )
    const totalWithdrawable = withdrawableUnlocks.reduce((prev, event) => prev.add(event.amount), BigNumber.from(0))
    const nextUnlock = unlocks
      .filter((unlock) => !isGreater24HoursDiff(Date.parse(unlock.executionDate), Date.now()))
      .reduce((prev: undefined | UnlockEvent, current) => {
        // We look for the oldest unlock event that is not older than 24h
        const currentExecDate = Date.parse(current.executionDate)
        const prevExecDate = prev ? Date.parse(prev.executionDate) : undefined
        return prevExecDate === undefined || currentExecDate < prevExecDate ? current : prev
      }, undefined)

    return {
      totalWithdrawable,
      nextUnlock,
    }
  }, [lockHistory])

  return { totalLocked, totalUnlocked, totalWithdrawable, nextUnlock }
}
