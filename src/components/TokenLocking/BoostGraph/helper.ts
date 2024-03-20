import { getBoostFunction } from '@/utils/boost'
import { LockHistory } from '@/utils/lock'

export const generatePointsFromHistory = (pastLocks: LockHistory[], nowInDays: number): { x: number; y: number }[] => {
  const boostFunction = getBoostFunction(nowInDays, 0, pastLocks)
  return pastLocks.map((lock) => ({
    x: lock.day,
    y: boostFunction({ x: lock.day }),
  }))
}
