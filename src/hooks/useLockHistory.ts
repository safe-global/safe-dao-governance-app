import { LockHistory } from '@/utils/boost'

export const useLockHistory = (): LockHistory[] => {
  return [
    {
      day: 0,
      amount: 10000,
    },
  ]
}

export const FAKE_NOW = 30
