import { Chains, CHAIN_START_TIMESTAMPS } from '@/config/constants'
import { formatDay, getRelativeTime, timeRemaining } from '../date'

describe('date', () => {
  let now = 0
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01'))
    now = Date.now() / 1000
  })
  describe('timeRemaining', () => {
    it('should return zeroes for 0 millis', () => {
      expect(timeRemaining(now)).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      })
    })

    it('should return zeroes for negative millis', () => {
      expect(timeRemaining(now - 1)).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      })
    })

    it('should compute days', () => {
      expect(timeRemaining(now + 60 * 60 * 24 * 3)).toEqual({
        days: 3,
        hours: 0,
        minutes: 0,
        seconds: 0,
      })
    })

    it('should compute hours', () => {
      expect(timeRemaining(now + 60 * 60 * 4)).toEqual({
        days: 0,
        hours: 4,
        minutes: 0,
        seconds: 0,
      })
    })
    it('should compute minutes', () => {
      expect(timeRemaining(now + 60 * 5)).toEqual({
        days: 0,
        hours: 0,
        minutes: 5,
        seconds: 0,
      })
    })
    it('should compute seconds', () => {
      expect(timeRemaining(now + 6)).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 6,
      })
    })

    it('should compute mixed amounds', () => {
      expect(timeRemaining(now + 6 + 60 * 5 + 60 * 60 * 4 + 60 * 60 * 24 * 3)).toEqual({
        days: 3,
        hours: 4,
        minutes: 5,
        seconds: 6,
      })
    })
  })

  describe('formatDay', () => {
    it('should work for negative numbers', () => {
      expect(formatDay(-1, CHAIN_START_TIMESTAMPS[Chains.MAINNET])).toEqual('April 22')
    })

    it('should work for zero', () => {
      expect(formatDay(0, CHAIN_START_TIMESTAMPS[Chains.MAINNET])).toEqual('April 23')
    })

    it('should work for positive numbers', () => {
      expect(formatDay(7, CHAIN_START_TIMESTAMPS[Chains.MAINNET])).toEqual('April 30')
    })

    it('should work for future months', () => {
      expect(formatDay(30, CHAIN_START_TIMESTAMPS[Chains.MAINNET])).toEqual('May 23')
    })
  })

  describe('getRelativeTime', () => {
    it('should diff to current time with only start date provided', () => {
      // Fake now is 01-01-2024
      expect(getRelativeTime(new Date('2024-01-15T01:00:00.000Z'))).toBe('in 2 weeks')
      expect(getRelativeTime(new Date('2024-01-08T01:00:00.000Z'))).toBe('in 1 week')
      expect(getRelativeTime(new Date('2024-01-02T01:00:00.000Z'))).toBe('in 1 day')
      expect(getRelativeTime(new Date('2024-01-01T01:00:00.000Z'))).toBe('in 1 hour')
      expect(getRelativeTime(new Date('2024-01-01T00:01:00.000Z'))).toBe('in 1 minute')
      expect(getRelativeTime(new Date('2024-01-01T00:00:59.000Z'))).toBe('in 59 seconds')
      expect(getRelativeTime(new Date('2023-12-31T23:59:59.000Z'))).toBe('1 second ago')
      expect(getRelativeTime(new Date('2023-12-31T23:59:00.000Z'))).toBe('1 minute ago')
    })
  })
})
