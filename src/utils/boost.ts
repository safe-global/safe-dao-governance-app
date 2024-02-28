export type PastLock = {
  day: number
  amount: number
}

export const getLockBoost = (amountLocked: number) => {
  if (amountLocked < 100) {
    return 1
  }
  if (amountLocked < 10_000) {
    return amountLocked / 4950 + 97 / 99
  }
  if (amountLocked < 100_000) {
    return amountLocked / 90000 + 26 / 9
  }
  if (amountLocked < 1_000_000) {
    return amountLocked / 900000 + 35 / 9
  }
  return 5
}

export const getEarlyBirdBoost = (days: number) => {
  if (days > 48) {
    return 0
  }
  return 2 - days / 24
}

export const getEarlyBirdBoostAdvanced =
  (now: number, amountLocked: number, pastLocks: PastLock[]) => (d: { x: number }) => {
    let firstEarlyBirdLock = pastLocks.find((value) => value.amount >= 1000 && value.day <= d.x)?.day

    if (firstEarlyBirdLock === undefined) {
      firstEarlyBirdLock = amountLocked >= 1000 && now <= d.x ? now : 48
    }
    return getEarlyBirdBoost(firstEarlyBirdLock)
  }

export const getBoostFunction = (now: number, amountLocked: number, pastLocks: PastLock[]) => (d: { x: number }) => {
  const earlyBoost = getEarlyBirdBoostAdvanced(now, amountLocked, pastLocks)(d)
  const pastAmounts = pastLocks.filter((value) => value.day <= d.x).reduce((prev, current) => prev + current.amount, 0)
  const totalAmount = pastAmounts + (now <= d.x ? amountLocked : 0)
  const lockBoost = getLockBoost(totalAmount)

  return lockBoost + earlyBoost
}
