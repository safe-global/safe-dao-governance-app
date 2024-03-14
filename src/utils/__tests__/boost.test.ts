import { SEASON1_START, SEASON2_START } from '@/components/TokenLocking/BoostGraph/graphConstants'
import { floorNumber, getBoostFunction, getTimeFactor, getTokenBoost, LockHistory } from '../boost'

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
    it('should return 0 for amounts below 100', () => {
      expect(getTokenBoost(0)).toBe(0)
      expect(getTokenBoost(1)).toBe(0)
      expect(getTokenBoost(50)).toBe(0)
      expect(getTokenBoost(99)).toBe(0)
      expect(getTokenBoost(100)).toBe(0)
    })

    it('should use the correct function for amounts between 100 and 1000', () => {
      expect(getTokenBoost(101)).toBe(101 / 900 - 1 / 9)
      expect(getTokenBoost(500)).toBe(500 / 900 - 1 / 9)
      expect(getTokenBoost(1000)).toBe(1)
    })

    it('should use the correct function for amounts between 1000 and 10000', () => {
      expect(getTokenBoost(1001)).toBe(1001 / 9000 + 8 / 9)
      expect(getTokenBoost(5000)).toBe(5000 / 9000 + 8 / 9)
      expect(getTokenBoost(10000)).toBe(2)
    })

    it('should use the correct function for amounts between 100 and 1000', () => {
      expect(getTokenBoost(10001)).toBe(10001 / 90000 + 17 / 9)
      expect(getTokenBoost(50000)).toBe(50000 / 90000 + 17 / 9)
      expect(getTokenBoost(100000)).toBe(100000 / 90000 + 17 / 9)
    })

    it('should use the correct function for amounts between 100 and 1000', () => {
      expect(getTokenBoost(100001)).toBe(100001 / 900000 + 26 / 9)
      expect(getTokenBoost(500000)).toBe(500000 / 900000 + 26 / 9)
      expect(getTokenBoost(1000000)).toBe(1000000 / 900000 + 26 / 9)
    })
  })

  describe('getTimeFactor', () => {
    it('should return 0 for negative days', () => {
      expect(getTimeFactor(-1)).toBe(0)
    })

    it('should return 1 on first day', () => {
      expect(getTimeFactor(0)).toBe(1)
    })

    it('should use the correct function in pre season', () => {
      expect(getTimeFactor(24)).toBe(1 - 0.0106383 * 24)
    })

    it('should be < .5 on last day of pre season', () => {
      expect(getTimeFactor(47)).toBeLessThan(0.5)
    })

    it('should be .5 on first day of season', () => {
      expect(getTimeFactor(48)).toBe(0.5)
    })

    it('should use the correct function during season', () => {
      expect(getTimeFactor(50)).toBe(0.5 - 0.0045045 * 2)
    })

    it('should use the correct function for amounts between 1000 and 10000', () => {
      expect(getTokenBoost(1001)).toBe(1001 / 9000 + 8 / 9)
      expect(getTokenBoost(5000)).toBe(5000 / 9000 + 8 / 9)
      expect(getTokenBoost(10000)).toBe(10000 / 9000 + 8 / 9)
    })
  })

  describe('getBoostFunction', () => {
    describe('without prior locks on day 0', () => {
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
        expect(boostFunction({ x: -1 })).toBe(1)
        expect(boostFunction({ x: 0 })).toBe(1)
        expect(boostFunction({ x: SEASON1_START })).toBe(1.5)
        expect(boostFunction({ x: SEASON2_START })).toBe(2)
        expect(boostFunction({ x: 1000 })).toBe(2)
      })

      it('should compute boost with 10000 tokens locked', () => {
        const boostFunction = getBoostFunction(0, 10000, [])
        expect(boostFunction({ x: -1 })).toBe(1)
        expect(boostFunction({ x: 0 })).toBe(1)
        expect(boostFunction({ x: SEASON1_START })).toBe(2)
        expect(boostFunction({ x: SEASON2_START })).toBe(3)
        expect(boostFunction({ x: 1000 })).toBe(3)
      })

      it('should compute boost with 100000 tokens locked', () => {
        const boostFunction = getBoostFunction(0, 100000, [])
        expect(boostFunction({ x: -1 })).toBe(1)
        expect(boostFunction({ x: 0 })).toBe(1)
        expect(boostFunction({ x: SEASON1_START })).toBe(2.5)
        expect(boostFunction({ x: SEASON2_START })).toBe(4)
        expect(boostFunction({ x: 1000 })).toBe(4)
      })

      it('should compute boost with 1000000 tokens locked', () => {
        const boostFunction = getBoostFunction(0, 1000000, [])
        expect(boostFunction({ x: -1 })).toBe(1)
        expect(boostFunction({ x: 0 })).toBe(1)
        expect(boostFunction({ x: SEASON1_START })).toBe(3)
        expect(boostFunction({ x: SEASON2_START })).toBe(5)
        expect(boostFunction({ x: 1000 })).toBe(5)
      })
    })

    describe('on season start without prior locks', () => {
      it('should always return 1.0 for amount 0', () => {
        const boostFunction = getBoostFunction(SEASON1_START, 0, [])
        expect(boostFunction({ x: -1 })).toBe(1)
        expect(boostFunction({ x: 0 })).toBe(1)
        expect(boostFunction({ x: SEASON1_START })).toBe(1)
        expect(boostFunction({ x: SEASON2_START })).toBe(1)
        expect(boostFunction({ x: 1000 })).toBe(1)
      })

      it('should compute boost with 1000 tokens locked', () => {
        const boostFunction = getBoostFunction(SEASON1_START, 1000, [])
        expect(boostFunction({ x: -1 })).toBe(1)
        expect(boostFunction({ x: 0 })).toBe(1)
        expect(boostFunction({ x: SEASON1_START })).toBe(1)
        expect(boostFunction({ x: SEASON2_START })).toBe(1.5)
        expect(boostFunction({ x: 1000 })).toBe(1.5)
      })

      it('should compute boost with 10000 tokens locked', () => {
        const boostFunction = getBoostFunction(SEASON1_START, 10000, [])
        expect(boostFunction({ x: -1 })).toBe(1)
        expect(boostFunction({ x: 0 })).toBe(1)
        expect(boostFunction({ x: SEASON1_START })).toBe(1)
        expect(boostFunction({ x: SEASON2_START })).toBe(2)
        expect(boostFunction({ x: 1000 })).toBe(2)
      })

      it('should compute boost with 100000 tokens locked', () => {
        const boostFunction = getBoostFunction(SEASON1_START, 100000, [])
        expect(boostFunction({ x: -1 })).toBe(1)
        expect(boostFunction({ x: 0 })).toBe(1)
        expect(boostFunction({ x: SEASON1_START })).toBe(1)
        expect(boostFunction({ x: SEASON2_START })).toBe(2.5)
        expect(boostFunction({ x: 1000 })).toBe(2.5)
      })

      it('should compute boost with 1000000 tokens locked', () => {
        const boostFunction = getBoostFunction(SEASON1_START, 1000000, [])
        expect(boostFunction({ x: -1 })).toBe(1)
        expect(boostFunction({ x: 0 })).toBe(1)
        expect(boostFunction({ x: SEASON1_START })).toBe(1)
        expect(boostFunction({ x: SEASON2_START })).toBe(3)
        expect(boostFunction({ x: 1000 })).toBe(3)
      })
    })

    it('should compute for 1000 tokens on day one and 9000 on season start', () => {
      const priorLock: LockHistory = {
        day: 0,
        amount: 1000,
      }
      const boostFunction = getBoostFunction(SEASON1_START, 9000, [priorLock])

      expect(boostFunction({ x: -1 })).toBe(1)
      expect(boostFunction({ x: 0 })).toBe(1)
      expect(boostFunction({ x: SEASON1_START })).toBe(1.5)
      expect(boostFunction({ x: SEASON2_START })).toBe(2.5)
      expect(boostFunction({ x: 1000 })).toBe(2.5)
    })

    it('should compute for 1000 tokens on day one and 9000 on mid pre-season and 90000 on season start', () => {
      const priorLocks: LockHistory[] = [
        {
          day: 0,
          amount: 1000,
        },
        {
          day: 24,
          amount: 9000,
        },
        {
          day: SEASON1_START,
          amount: 90000,
        },
      ]
      const boostFunction = getBoostFunction(SEASON1_START, 0, priorLocks)

      expect(boostFunction({ x: -1 })).toBe(1)
      expect(boostFunction({ x: 0 })).toBe(1)
      expect(boostFunction({ x: SEASON1_START })).toBeCloseTo(1.75, 1)
      expect(boostFunction({ x: SEASON2_START })).toBeCloseTo(3.25, 1)
      expect(boostFunction({ x: 1000 })).toBeCloseTo(3.25, 1)
    })

    it('should merge locks and unlocks on the same day', () => {
      const priorLocks: LockHistory[] = [
        {
          day: 0,
          amount: 10000,
        },
        {
          day: 0,
          amount: -9000,
        },
        {
          day: SEASON1_START,
          amount: 9000,
        },
      ]
      const boostFunction = getBoostFunction(SEASON1_START, 0, priorLocks)

      expect(boostFunction({ x: -1 })).toBe(1)
      expect(boostFunction({ x: 0 })).toBe(1)
      expect(boostFunction({ x: SEASON1_START })).toBe(1.5)
      expect(boostFunction({ x: SEASON2_START })).toBe(2.5)
      expect(boostFunction({ x: 1000 })).toBe(2.5)
    })

    it('should be static if everything gets unlocked', () => {
      const priorLocks: LockHistory[] = [
        {
          day: 0,
          amount: 10000,
        },
      ]
      const boostFunction = getBoostFunction(SEASON1_START, -10000, priorLocks)

      expect(boostFunction({ x: -1 })).toBe(1)
      expect(boostFunction({ x: 0 })).toBe(1)
      expect(boostFunction({ x: SEASON1_START })).toBe(2)
      expect(boostFunction({ x: SEASON2_START })).toBe(2)
      expect(boostFunction({ x: 1000 })).toBe(2)
    })
  })
})
