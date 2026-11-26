import { createElement } from 'react'
import type { ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { BigNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { JsonRpcProvider } from '@ethersproject/providers'
import { renderHook, waitFor } from '@testing-library/react'

import { CHAIN_SAFE_LOCKING_ADDRESS, MULTICALL3_ADDRESS } from '@/config/constants'
import { lockInterface, multicallInterface, useLockState } from '@/hooks/useLockState'
import { useWeb3 } from '@/hooks/useWeb3'
import { useAddress } from '@/hooks/useAddress'
import { useChainId } from '@/hooks/useChainId'

jest.mock('@/hooks/useWeb3', () => ({ useWeb3: jest.fn() }))
jest.mock('@/hooks/useAddress', () => ({ useAddress: jest.fn() }))
jest.mock('@/hooks/useChainId', () => ({ useChainId: jest.fn() }))

const CHAIN_ID = '11155111'
const LOCK_ADDRESS = CHAIN_SAFE_LOCKING_ADDRESS[CHAIN_ID]
const HOLDER = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' // Hardhat test account #0

type User = { locked: BigNumber; unlocked: BigNumber; unlockStart: number; unlockEnd: number }
type Unlock = { amount: BigNumber; maturesAt: number }

const ZERO = BigNumber.from(0)

// A fresh SWR cache per test so results don't leak between cases
const wrapper = ({ children }: { children?: ReactNode }) =>
  createElement(
    SWRConfig,
    { value: { provider: () => new Map(), dedupingInterval: 0, shouldRetryOnError: false } },
    children,
  )

describe('useLockState', () => {
  // Maturities are set relative to the real clock at the start of each test
  let NOW: number
  let provider: JsonRpcProvider
  let mockCall: jest.Mock

  const encodeUnlock = (unlocks: Record<number, Unlock>, index: number) =>
    lockInterface.encodeFunctionResult('getUnlock', [unlocks[index] ?? { amount: ZERO, maturesAt: 0 }])

  const mockContract = (user: User, unlocks: Record<number, Unlock> = {}) => {
    mockCall.mockImplementation(async ({ to, data }: { to: string; data: string }) => {
      if (to === LOCK_ADDRESS) {
        const tx = lockInterface.parseTransaction({ data })
        if (tx.name === 'getUser') {
          return lockInterface.encodeFunctionResult('getUser', [user])
        }
        // getUnlock must go through Multicall3
        throw new Error(`Unexpected direct call ${tx.name}`)
      }
      if (to === MULTICALL3_ADDRESS) {
        const [calls] = multicallInterface.parseTransaction({ data }).args
        const results = calls.map(({ target, callData }: { target: string; callData: string }) => {
          expect(target).toBe(LOCK_ADDRESS)
          const tx = lockInterface.parseTransaction({ data: callData })
          expect(tx.name).toBe('getUnlock')
          return { success: true, returnData: encodeUnlock(unlocks, tx.args[1]) }
        })
        return multicallInterface.encodeFunctionResult('aggregate3', [results])
      }
      throw new Error(`Unexpected call to ${to}`)
    })
  }

  // Unlock indices requested through Multicall3, in order
  const getUnlockIndices = () =>
    mockCall.mock.calls
      .filter(([{ to }]) => to === MULTICALL3_ADDRESS)
      .flatMap(([{ data }]) => multicallInterface.parseTransaction({ data }).args[0])
      .map(({ callData }: { callData: string }) => lockInterface.parseTransaction({ data: callData }).args[1])

  beforeEach(() => {
    NOW = Math.floor(Date.now() / 1000)

    provider = new JsonRpcProvider()
    mockCall = jest.fn()
    provider.call = mockCall

    jest.mocked(useWeb3).mockReturnValue(provider)
    jest.mocked(useAddress).mockReturnValue(HOLDER)
    jest.mocked(useChainId).mockReturnValue(CHAIN_ID)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const render = async () => {
    const { result } = renderHook(() => useLockState(), { wrapper })
    await waitFor(() => expect(result.current.data ?? result.current.error).toBeDefined())
    return result
  }

  it('returns zeros and makes no getUnlock call when there is no position', async () => {
    mockContract({ locked: ZERO, unlocked: ZERO, unlockStart: 0, unlockEnd: 0 })

    const result = await render()

    expect(result.current.error).toBeUndefined()
    expect(result.current.data?.locked.eq(0)).toBe(true)
    expect(result.current.data?.unlocked.eq(0)).toBe(true)
    expect(result.current.data?.withdrawable.eq(0)).toBe(true)
    expect(result.current.data?.pendingUnlocks).toEqual([])
    expect(mockCall).toHaveBeenCalledTimes(1)
  })

  it('returns the locked amount when nothing is unlocked', async () => {
    mockContract({ locked: parseEther('1000'), unlocked: ZERO, unlockStart: 0, unlockEnd: 0 })

    const result = await render()

    expect(result.current.data?.locked.eq(parseEther('1000'))).toBe(true)
    expect(result.current.data?.unlocked.eq(0)).toBe(true)
    expect(result.current.data?.withdrawable.eq(0)).toBe(true)
    expect(result.current.data?.pendingUnlocks).toEqual([])
  })

  it('counts a matured unlock as withdrawable', async () => {
    mockContract(
      { locked: ZERO, unlocked: parseEther('50'), unlockStart: 0, unlockEnd: 1 },
      { 0: { amount: parseEther('50'), maturesAt: NOW - 60 } },
    )

    const result = await render()

    expect(result.current.data?.unlocked.eq(parseEther('50'))).toBe(true)
    expect(result.current.data?.withdrawable.eq(parseEther('50'))).toBe(true)
    expect(result.current.data?.pendingUnlocks).toEqual([])
  })

  it('treats an unlock maturing exactly now as withdrawable', async () => {
    mockContract(
      { locked: ZERO, unlocked: parseEther('5'), unlockStart: 0, unlockEnd: 1 },
      { 0: { amount: parseEther('5'), maturesAt: NOW } },
    )

    const result = await render()

    expect(result.current.data?.withdrawable.eq(parseEther('5'))).toBe(true)
    expect(result.current.data?.pendingUnlocks).toEqual([])
  })

  it('lists a pending unlock with its maturity date', async () => {
    const maturesAt = NOW + 86_400
    mockContract(
      { locked: parseEther('10'), unlocked: parseEther('20'), unlockStart: 0, unlockEnd: 1 },
      { 0: { amount: parseEther('20'), maturesAt } },
    )

    const result = await render()

    expect(result.current.data?.withdrawable.eq(0)).toBe(true)
    expect(result.current.data?.pendingUnlocks).toHaveLength(1)
    expect(result.current.data?.pendingUnlocks[0].index).toBe(0)
    expect(result.current.data?.pendingUnlocks[0].amount.eq(parseEther('20'))).toBe(true)
    expect(result.current.data?.pendingUnlocks[0].maturesAt).toBe(maturesAt)
  })

  it('reads unlocks from unlockStart to unlockEnd - 1 and sums matured ones', async () => {
    mockContract(
      { locked: parseEther('100'), unlocked: parseEther('6'), unlockStart: 3, unlockEnd: 6 },
      {
        3: { amount: parseEther('1'), maturesAt: NOW - 2 * 86_400 },
        4: { amount: parseEther('2'), maturesAt: NOW - 86_400 },
        5: { amount: parseEther('3'), maturesAt: NOW + 3_600 },
      },
    )

    const result = await render()

    expect(getUnlockIndices()).toEqual([3, 4, 5])
    expect(mockCall).toHaveBeenCalledTimes(2) // getUser + one Multicall3 batch
    expect(result.current.data?.locked.eq(parseEther('100'))).toBe(true)
    expect(result.current.data?.unlocked.eq(parseEther('6'))).toBe(true)
    expect(result.current.data?.withdrawable.eq(parseEther('3'))).toBe(true)
    expect(result.current.data?.pendingUnlocks.map((u) => u.index)).toEqual([5])
    expect(result.current.data?.pendingUnlocks[0].amount.eq(parseEther('3'))).toBe(true)
  })

  it('returns an error when the RPC call fails', async () => {
    mockCall.mockRejectedValue(new Error('RPC down'))

    const result = await render()

    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeInstanceOf(Error)
  })

  it('does not fetch on chains without a lock contract', () => {
    jest.mocked(useChainId).mockReturnValue('100')

    const { result } = renderHook(() => useLockState(), { wrapper })

    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
    expect(mockCall).not.toHaveBeenCalled()
  })
})
