import { getBoostFunction } from '@/utils/boost'
import { LockHistory } from '@/utils/lock'

export const generatePointsFromHistory = (pastLocks: LockHistory[], nowInDays: number): { x: number; y: number }[] => {
  const boostFunction = getBoostFunction(nowInDays, 0, pastLocks)
  // find each individual day
  const days = pastLocks.map((lock) => lock.day).filter((day, index, days) => days.indexOf(day) === index)

  return days
    .map((day) => ({
      x: day,
      y: boostFunction({ x: day }),
    }))
    .slice(0, -1)
}
