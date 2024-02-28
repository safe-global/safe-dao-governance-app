import { PastLock } from '@/utils/boost'

export const useLockHistory = (): PastLock[] => {
  return []
  return [
    {
      day: 3,
      amount: 999,
    },

    {
      day: 15,
      amount: 1200,
    },
  ]
}

export const FAKE_NOW = 0
