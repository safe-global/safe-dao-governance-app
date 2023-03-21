import { hexZeroPad } from 'ethers/lib/utils'
import { act, renderHook, waitFor } from '@testing-library/react'

import * as useWeb3Hook from '@/hooks/useWeb3'
import * as useSafeTokenAllocationHook from '@/hooks/useSafeTokenAllocation'
import * as SafeToken from '@/services/contracts/SafeToken'
import { useSafeTokenAllocationInvalidator } from '@/hooks/useSafeTokenAllocationInvalidator'

jest.mock('@/hooks/useWeb3', () => ({
  useWeb3: jest.fn(),
}))

jest.mock('@/hooks/useSafeTokenAllocation', () => ({
  useSafeTokenAllocation: jest.fn(),
}))

jest.mock('@/services/contracts/SafeToken', () => ({
  getSafeTokenContract: jest.fn(),
}))

describe('useSafeTokenAllocationInvalidator', () => {
  const CHAIN_ID = 5
  const MOCK_ADDRESS = hexZeroPad('0x1', 20)

  const BASE_BLOCK_NUMBER = 0

  const MOCK_TO_FILTER = 'mockToFilter'
  const MOCK_FROM_FILTER = 'mockFromFilter'

  jest.useFakeTimers()

  let mockQueryFilter: jest.Mock
  let mockMutate: jest.Mock

  let setIntervalSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()

    jest.spyOn(useWeb3Hook, 'useWeb3').mockImplementation(
      jest.fn(() => ({
        getSigner: jest.fn(() => ({
          getChainId: () => Promise.resolve(CHAIN_ID),
          getAddress: () => Promise.resolve(MOCK_ADDRESS),
        })),
        getBlockNumber: () => Promise.resolve(BASE_BLOCK_NUMBER),
      })) as unknown as typeof useWeb3Hook.useWeb3,
    )

    mockMutate = jest.fn()
    jest.spyOn(useSafeTokenAllocationHook, 'useSafeTokenAllocation').mockImplementation(
      jest.fn(() => ({
        mutate: mockMutate,
      })) as unknown as typeof useSafeTokenAllocationHook.useSafeTokenAllocation,
    )

    // TODO: Can be made more robust by mocking signer instead of this
    mockQueryFilter = jest.fn()
    jest.spyOn(SafeToken, 'getSafeTokenContract').mockImplementation(
      jest.fn(() => ({
        queryFilter: mockQueryFilter,
        filters: {
          Transfer: jest.fn((signerAddress) => {
            return signerAddress ? MOCK_FROM_FILTER : MOCK_TO_FILTER
          }),
        },
      })) as unknown as typeof SafeToken.getSafeTokenContract,
    )

    setIntervalSpy = jest.spyOn(global, 'setInterval')
  })

  it('should invalidate the cache if the to transfer filter returns new event(s)', async () => {
    mockQueryFilter.mockImplementation(
      jest.fn((filter) => {
        return filter === MOCK_TO_FILTER
          ? Promise.resolve([{ blockNumber: BASE_BLOCK_NUMBER + 1 }])
          : Promise.resolve([])
      }),
    )

    renderHook(() => useSafeTokenAllocationInvalidator())

    expect(mockQueryFilter).not.toHaveBeenCalled()
    expect(mockMutate).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(setIntervalSpy).toHaveBeenCalledTimes(1)
    })

    // First interval
    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(mockQueryFilter).toHaveBeenCalledTimes(2)
    expect(mockQueryFilter.mock.calls).toEqual([
      [MOCK_FROM_FILTER, BASE_BLOCK_NUMBER, 'latest'],
      [MOCK_TO_FILTER, BASE_BLOCK_NUMBER, 'latest'],
    ])

    // Invalidate cache
    await waitFor(() => {
      expect(mockMutate).toBeCalledTimes(1)
    })
  })

  it('should invalidate the cache if the from transfer filter return new event(s)', async () => {
    mockQueryFilter.mockImplementation(
      jest.fn((filter) => {
        return filter === MOCK_FROM_FILTER
          ? Promise.resolve([{ blockNumber: BASE_BLOCK_NUMBER + 1 }])
          : Promise.resolve([])
      }),
    )

    renderHook(() => useSafeTokenAllocationInvalidator())

    expect(mockQueryFilter).not.toHaveBeenCalled()
    expect(mockMutate).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(setIntervalSpy).toHaveBeenCalledTimes(1)
    })

    // First interval
    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(mockQueryFilter).toHaveBeenCalledTimes(2)
    expect(mockQueryFilter.mock.calls).toEqual([
      [MOCK_FROM_FILTER, BASE_BLOCK_NUMBER, 'latest'],
      [MOCK_TO_FILTER, BASE_BLOCK_NUMBER, 'latest'],
    ])

    // Invalidate cache
    await waitFor(() => {
      expect(mockMutate).toBeCalledTimes(1)
    })
  })

  it('should invalidate the cache if both filters return new event(s)', async () => {
    mockQueryFilter.mockResolvedValue([{ blockNumber: BASE_BLOCK_NUMBER + 1 }])

    renderHook(() => useSafeTokenAllocationInvalidator())

    expect(mockQueryFilter).not.toHaveBeenCalled()
    expect(mockMutate).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(setIntervalSpy).toHaveBeenCalledTimes(1)
    })

    // First interval
    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(mockQueryFilter).toHaveBeenCalledTimes(2)
    expect(mockQueryFilter.mock.calls).toEqual([
      [MOCK_FROM_FILTER, BASE_BLOCK_NUMBER, 'latest'],
      [MOCK_TO_FILTER, BASE_BLOCK_NUMBER, 'latest'],
    ])

    // Invalidate cache
    await waitFor(() => {
      expect(mockMutate).toBeCalledTimes(1)
    })
  })

  it('should not invalidate the cache if both filters return no event(s)', async () => {
    mockQueryFilter.mockResolvedValue([])

    renderHook(() => useSafeTokenAllocationInvalidator())

    expect(mockQueryFilter).not.toHaveBeenCalled()
    expect(mockMutate).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(setIntervalSpy).toHaveBeenCalledTimes(1)
    })

    // First interval
    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(mockQueryFilter).toBeCalledTimes(2)
    expect(mockQueryFilter.mock.calls).toEqual([
      [MOCK_FROM_FILTER, BASE_BLOCK_NUMBER, 'latest'],
      [MOCK_TO_FILTER, BASE_BLOCK_NUMBER, 'latest'],
    ])

    // Ensure mutation could have happened
    await Promise.resolve()

    // Don't invalidate cache
    expect(mockMutate).not.toHaveBeenCalled()
  })

  it('should not invalidate the cache if the subsequent filter poll returns no event(s)', async () => {
    mockQueryFilter.mockResolvedValue([{ blockNumber: BASE_BLOCK_NUMBER + 1 }])

    renderHook(() => useSafeTokenAllocationInvalidator())

    expect(mockQueryFilter).not.toHaveBeenCalled()
    expect(mockMutate).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(setIntervalSpy).toHaveBeenCalledTimes(1)
    })

    // First interval
    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(mockQueryFilter).toBeCalledTimes(2)
    expect(mockQueryFilter.mock.calls).toEqual([
      [MOCK_FROM_FILTER, BASE_BLOCK_NUMBER, 'latest'],
      [MOCK_TO_FILTER, BASE_BLOCK_NUMBER, 'latest'],
    ])

    // Invalidate cache
    await waitFor(() => {
      expect(mockMutate).toBeCalledTimes(1)
    })

    mockQueryFilter.mockResolvedValue([])

    // Second interval
    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(mockQueryFilter).toBeCalledTimes(4)
    expect(mockQueryFilter.mock.calls).toEqual([
      // Previous calls
      [MOCK_FROM_FILTER, BASE_BLOCK_NUMBER, 'latest'],
      [MOCK_TO_FILTER, BASE_BLOCK_NUMBER, 'latest'],
      // New calls
      [MOCK_FROM_FILTER, BASE_BLOCK_NUMBER + 1, 'latest'],
      [MOCK_TO_FILTER, BASE_BLOCK_NUMBER + 1, 'latest'],
    ])

    // Ensure second mutation could have happened
    await Promise.resolve()

    // Don't invalidate cache
    expect(mockMutate).toBeCalledTimes(1)
  })
})
