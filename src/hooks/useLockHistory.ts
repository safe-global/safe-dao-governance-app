import { LockHistory } from '@/utils/boost'

export const useLockHistory = (): LockHistory[] => {
  return [
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
}

export const FAKE_NOW = 40
