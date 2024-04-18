import { SEASON1_START, SEASON2_START } from '@/config/constants'
import { floorNumber, getBoostFunction, getTimeFactor, getTokenBoost } from '../boost'
import { LockHistory } from '../lock'

describe('boost', () => {
  describe('floorNumber', () => {
    it('should floor numbers without decimals', () => {
      expect(floorNumber(2.0, 2)).toEqual(2)
    })

    it('should floor numbers above .5 decimals', () => {
      expect(floorNumber(2.449, 1)).toEqual(2.4)
    })

    it('should floor numbers with .5 decimals', () => {
      expect(floorNumber(2.45, 1)).toEqual(2.4)
    })

    it('should floor numbers above .5 decimals', () => {
      expect(floorNumber(2.49, 1)).toEqual(2.4)
    })
  })

  describe('getTokenBoost', () => {
    it('should return 0 for NaN amount', () => {
      expect(getTokenBoost(Number('*'))).toBe(0)
      expect(getTokenBoost(Number('100-10'))).toBe(0)
      expect(getTokenBoost(Number('100**10'))).toBe(0)
    })
    it('should return 0 for amounts below 100', () => {
      expect(getTokenBoost(0)).toBe(0)
      expect(getTokenBoost(1)).toBe(0)
      expect(getTokenBoost(50)).toBe(0)
      expect(getTokenBoost(99)).toBe(0)
      expect(getTokenBoost(100)).toBe(0)
    })

    it('should use the correct function for amounts between 100 and 1000', () => {
      expect(getTokenBoost(101)).toBe(101 * 0.000277778 - 0.0277778)
      expect(getTokenBoost(500)).toBe(500 * 0.000277778 - 0.0277778)
      expect(getTokenBoost(1000)).toBeCloseTo(0.25)
    })

    it('should use the correct function for amounts between 1000 and 10000', () => {
      expect(getTokenBoost(1001)).toBe(1001 * 0.0000277778 + 0.222222)
      expect(getTokenBoost(5000)).toBe(5000 * 0.0000277778 + 0.222222)
      expect(getTokenBoost(10000)).toBe(0.5)
    })

    it('should use the correct function for amounts between 10001 and 100000', () => {
      expect(getTokenBoost(10001)).toBe(10001 * 5.55556 * 10 ** -6 + 0.444444)
      expect(getTokenBoost(50000)).toBe(50000 * 5.55556 * 10 ** -6 + 0.444444)
      expect(getTokenBoost(100000)).toBe(1)
    })

    it('should be 1 for numbers above 100_000', () => {
      expect(getTokenBoost(100001)).toBe(1)
    })
  })

  describe('getTimeFactor', () => {
    it('should return 1 for negative days', () => {
      expect(getTimeFactor(-1)).toBe(1)
    })

    it('should return 1 on first day', () => {
      expect(getTimeFactor(0)).toBe(1)
    })

    it('should return 1 on first 28 days', () => {
      expect(getTimeFactor(27)).toBe(1)
    })

    it('should use the correct function after 28 days', () => {
      expect(getTimeFactor(30)).toBeCloseTo(1 - 3 / 133)
    })

    it('it should be 0 after the season', () => {
      expect(getTimeFactor(200)).toBe(0)
    })
  })

  describe('getBoostFunction', () => {
    describe('without prior locks on day 0', () => {
      it('should always return 1.0 for amount NaN', () => {
        const boostFunction = getBoostFunction(0, Number.NaN, [])
        expect(boostFunction({ x: -1 })).toBe(1)
        expect(boostFunction({ x: 0 })).toBe(1)
        expect(boostFunction({ x: SEASON1_START })).toBe(1)
        expect(boostFunction({ x: SEASON2_START })).toBe(1)
        expect(boostFunction({ x: 1000 })).toBe(1)
      })
      it('should always return 1.0 for amount 0', () => {
        const boostFunction = getBoostFunction(0, 0, [])
        expect(boostFunction({ x: -1 })).toBe(1)
        expect(boostFunction({ x: 0 })).toBe(1)
        expect(boostFunction({ x: SEASON1_START })).toBe(1)
        expect(boostFunction({ x: SEASON2_START })).toBe(1)
        expect(boostFunction({ x: 1000 })).toBe(1)
      })

      it('should compute boost with 1000 tokens locked', () => {
        const boostFunction = getBoostFunction(0, 1000, [])
        expect(boostFunction({ x: -1 })).toBeCloseTo(1)
        expect(boostFunction({ x: 0 })).toBeCloseTo(1.25)
        expect(boostFunction({ x: SEASON1_START })).toBeCloseTo(1.25)
        expect(boostFunction({ x: SEASON2_START })).toBeCloseTo(1.25)
        expect(boostFunction({ x: 1000 })).toBeCloseTo(1.25)
      })

      it('should compute boost with 10000 tokens locked', () => {
        const boostFunction = getBoostFunction(0, 10000, [])
        expect(boostFunction({ x: -1 })).toBeCloseTo(1)
        expect(boostFunction({ x: 0 })).toBeCloseTo(1.5)
        expect(boostFunction({ x: SEASON1_START })).toBeCloseTo(1.5)
        expect(boostFunction({ x: SEASON2_START })).toBeCloseTo(1.5)
        expect(boostFunction({ x: 1000 })).toBeCloseTo(1.5)
      })

      it('should compute boost with 1000000 tokens locked', () => {
        const boostFunction = getBoostFunction(0, 1000000, [])
        expect(boostFunction({ x: -1 })).toBe(1)
        expect(boostFunction({ x: 0 })).toBe(2)
        expect(boostFunction({ x: SEASON1_START })).toBe(2)
        expect(boostFunction({ x: SEASON2_START })).toBe(2)
        expect(boostFunction({ x: 1000 })).toBe(2)
      })
    })

    it('should compute for 100_000 tokens locked on day 0', () => {
      const boostFunction = getBoostFunction(0, 100_000, [])
      expect(boostFunction({ x: -1 })).toBe(1)
      expect(boostFunction({ x: 0 })).toBeCloseTo(2)
      expect(boostFunction({ x: 39 })).toBeCloseTo(2)
      expect(boostFunction({ x: 40 })).toBeCloseTo(2)
      expect(boostFunction({ x: 1000 })).toBeCloseTo(2)
    })

    it('should compute for 100_000 tokens locked on day 45', () => {
      const boostFunction = getBoostFunction(45, 100_000, [])
      expect(boostFunction({ x: -1 })).toBe(1)
      expect(boostFunction({ x: 0 })).toBeCloseTo(1)
      expect(boostFunction({ x: 44 })).toBeCloseTo(1)
      // 1.0 * 0.86 + 1 = 1.86
      expect(boostFunction({ x: 45 })).toBeCloseTo(1.86)
      expect(boostFunction({ x: 1000 })).toBeCloseTo(1.86)
    })

    it('should keep boost unchanged if NaN is the locked amount', () => {
      const priorLock: LockHistory = {
        day: 0,
        amount: 1000,
      }
      const boostFunction = getBoostFunction(40, Number.NaN, [priorLock])

      expect(boostFunction({ x: -1 })).toBe(1)
      expect(boostFunction({ x: 0 })).toBeCloseTo(1.25)
      expect(boostFunction({ x: 40 })).toBeCloseTo(1.25)
      expect(boostFunction({ x: 1000 })).toBeCloseTo(1.25)
    })

    it('should compute for 1000 tokens on day one and 1000 after 40 days', () => {
      const priorLock: LockHistory = {
        day: 0,
        amount: 1000,
      }
      const boostFunction = getBoostFunction(40, 1000, [priorLock])

      expect(boostFunction({ x: -1 })).toBe(1)
      expect(boostFunction({ x: 0 })).toBeCloseTo(1.25)
      expect(boostFunction({ x: 39 })).toBeCloseTo(1.25)
      //
      expect(boostFunction({ x: 40 })).toBeCloseTo(1.275)
      expect(boostFunction({ x: 1000 })).toBeCloseTo(1.275)
    })

    it('should compute for 1000 tokens on day one and 1000 after 40 days and another 1000 after 80 days', () => {
      const priorLocks: LockHistory[] = [
        {
          day: 0,
          amount: 1000,
        },
        {
          day: 40,
          amount: 1000,
        },
        {
          day: 80,
          amount: 1000,
        },
      ]
      const boostFunction = getBoostFunction(100, 0, priorLocks)

      expect(boostFunction({ x: -1 })).toBe(1)
      expect(boostFunction({ x: 0 })).toBeCloseTo(1.25)
      expect(boostFunction({ x: 39 })).toBeCloseTo(1.25)
      expect(boostFunction({ x: 40 })).toBeCloseTo(1.275)
      expect(boostFunction({ x: 79 })).toBeCloseTo(1.275)
      expect(boostFunction({ x: 80 })).toBeCloseTo(1.292)
      expect(boostFunction({ x: 1000 })).toBeCloseTo(1.292)
    })

    it('should drop to 1 if everything gets unlocked', () => {
      const priorLocks: LockHistory[] = [
        {
          day: 0,
          amount: 10000,
        },
      ]
      const boostFunction = getBoostFunction(SEASON1_START, -10000, priorLocks)

      expect(boostFunction({ x: -1 })).toBe(1)
      expect(boostFunction({ x: 0 })).toBeCloseTo(1.5)
      expect(boostFunction({ x: SEASON1_START })).toBe(1)
      expect(boostFunction({ x: SEASON2_START })).toBe(1)
      expect(boostFunction({ x: 1000 })).toBe(1)
    })

    it('should compute for 2000 tokens on day one, unlocking 1000 after 40 days and locking another 1000 after 80 days', () => {
      const priorLocks: LockHistory[] = [
        {
          day: 0,
          amount: 2000,
        },
        {
          day: 39,
          amount: -1000,
        },
        {
          day: 79,
          amount: 1000,
        },
      ]
      const boostFunction = getBoostFunction(100, 0, priorLocks)

      expect(boostFunction({ x: -1 })).toBe(1)
      expect(boostFunction({ x: 0 })).toBeCloseTo(1.277)
      expect(boostFunction({ x: 38 })).toBeCloseTo(1.277)
      // 0.25 * 0.91 + 1
      expect(boostFunction({ x: 39 })).toBeCloseTo(1.2275)
      expect(boostFunction({ x: 78 })).toBeCloseTo(1.2275)
      // 1.2275 + (1.277 - 1.25) * (0.609)
      expect(boostFunction({ x: 79 })).toBeCloseTo(1.2439)
      expect(boostFunction({ x: 1000 })).toBeCloseTo(1.2439)
    })
  })
})
