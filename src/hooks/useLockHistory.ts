import { LockHistory } from '@/utils/boost'

const FAKE_LOCKS = [
  {
    day: 0,
    amount: 1000,
  },
  {
    day: 10,
    amount: 5000,
  },
  {
    day: 20,
    amount: 4000,
  },
]

export const useLockHistory = (): LockHistory[] => {
  return FAKE_LOCKS
}

export const FAKE_NOW = 40
