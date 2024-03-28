import { renderHook } from '@/tests/test-utils'
import { hexZeroPad } from 'ethers/lib/utils'
import { WithdrawEvent, type LockEvent, type UnlockEvent } from '../useLockHistory'
import { useSummarizedLockHistory } from '../useSummarizedLockHistory'

const holder = hexZeroPad('0x1234', 20)

const FAKE_YESTERDAY = '2024-03-19T11:00:00.000Z'
const FAKE_TODAY = '2024-03-20T12:00:00.000Z'

const createLock = (amount: string, executionDate: string = FAKE_TODAY.toString()): LockEvent => ({
  executionDate,
  transactionHash: '0x93ba0541fe594f935807b559cfe21ae6d20d6785647579a2c7517f8aa9d38076',
  holder,
  amount,
  logIndex: '1',
  eventType: 'LOCKED',
})

const createUnlock = (
  amount: string,
  unlockIndex: string,
  executionDate: string = FAKE_TODAY.toString(),
): UnlockEvent => ({
  executionDate,
  transactionHash: '0x93ba0541fe594f935807b559cfe21ae6d20d6785647579a2c7517f8aa9d38076',
  holder,
  amount,
  logIndex: '1',
  eventType: 'UNLOCKED',
  unlockIndex,
})

const createWithdrawal = (
  amount: string,
  unlockIndex: string,
  executionDate: string = FAKE_TODAY.toString(),
): WithdrawEvent => ({
  executionDate,
  transactionHash: '0x93ba0541fe594f935807b559cfe21ae6d20d6785647579a2c7517f8aa9d38076',
  holder,
  amount,
  logIndex: '1',
  eventType: 'WITHDRAWN',
  unlockIndex,
})

describe('useSummarizedLockHistory', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(Date.parse(FAKE_TODAY))
  })

  afterAll(() => {
    jest.useRealTimers()
  })
  it('should return zeros for empty history', () => {
    const { result } = renderHook(() => useSummarizedLockHistory([]))

    expect(result.current.totalLocked.eq(0)).toBeTruthy()
    expect(result.current.totalUnlocked.eq(0)).toBeTruthy()
    expect(result.current.totalWithdrawable.eq(0)).toBeTruthy()
  })

  it('should add lock events', () => {
    const { result } = renderHook(() =>
      useSummarizedLockHistory([createLock('100'), createLock('200'), createLock('400')]),
    )

    expect(result.current.totalLocked.eq(700)).toBeTruthy()
    expect(result.current.totalUnlocked.eq(0)).toBeTruthy()
    expect(result.current.totalWithdrawable.eq(0)).toBeTruthy()
  })

  it('should summarize lock and unlock events', () => {
    const { result } = renderHook(() =>
      useSummarizedLockHistory([createLock('1000'), createUnlock('200', '1'), createUnlock('400', '2')]),
    )

    expect(result.current.totalLocked.eq(400)).toBeTruthy()
    expect(result.current.totalUnlocked.eq(600)).toBeTruthy()
    expect(result.current.totalWithdrawable.eq(0)).toBeTruthy()
  })

  it('should show withdrawable amount 24h after unlock', () => {
    const { result } = renderHook(() =>
      useSummarizedLockHistory([
        createLock('1000', FAKE_YESTERDAY.toString()),
        createUnlock('200', '1', FAKE_YESTERDAY.toString()),
        createUnlock('100', '2', FAKE_TODAY.toString()),
      ]),
    )

    expect(result.current.totalLocked.eq(700)).toBeTruthy()
    expect(result.current.totalUnlocked.eq(300)).toBeTruthy()
    expect(result.current.totalWithdrawable.eq(200)).toBeTruthy()
  })

  it('should substract already withdrawn amounts from withdrawable amount', () => {
    const { result } = renderHook(() =>
      useSummarizedLockHistory([
        createLock('1000', FAKE_YESTERDAY.toString()),
        createUnlock('200', '1', FAKE_YESTERDAY.toString()),
        createWithdrawal('200', '1', FAKE_TODAY.toString()),
        createUnlock('100', '2', FAKE_TODAY.toString()),
      ]),
    )

    expect(result.current.totalLocked.eq(700)).toBeTruthy()
    expect(result.current.totalUnlocked.eq(100)).toBeTruthy()
    expect(result.current.totalWithdrawable.eq(0)).toBeTruthy()
  })
})
