import { FAKE_NOW } from '@/hooks/useLockHistory'
import { getBoostFunction, LockHistory } from '@/utils/boost'

export const generatePointsFromHistory = (pastLocks: LockHistory[]): { x: number; y: number }[] => {
  const boostFunction = getBoostFunction(FAKE_NOW, 0, pastLocks)
  return pastLocks.map((lock) => ({
    x: lock.day,
    y: boostFunction({ x: lock.day }),
  }))
}
