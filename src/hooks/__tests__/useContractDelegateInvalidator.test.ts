import { hexZeroPad } from 'ethers/lib/utils'
import { act, renderHook, waitFor } from '@testing-library/react'

import * as useWeb3Hook from '@/hooks/useWeb3'
import * as useContractDelegateHook from '@/hooks/useContractDelegate'
import * as DelegateRegistry from '@/services/contracts/DelegateRegistry'
import { useContractDelegateInvalidator } from '@/hooks/useContractDelegateInvalidator'

jest.mock('@/hooks/useWeb3', () => ({
  useWeb3: jest.fn(),
}))

jest.mock('@/hooks/useContractDelegate', () => ({
  useContractDelegate: jest.fn(),
}))

jest.mock('@/services/contracts/DelegateRegistry', () => ({
  getDelegateRegistryContract: jest.fn(),
}))

describe('useContractDelegateInvalidator', () => {
  const CHAIN_ID = 5
  const MOCK_ADDRESS = hexZeroPad('0x1', 20)

  const BASE_BLOCK_NUMBER = 0

  const MOCK_FILTER = 'mockFilter'

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
    jest.spyOn(useContractDelegateHook, 'useContractDelegate').mockImplementation(
      jest.fn(() => ({
        mutate: mockMutate,
      })) as unknown as typeof useContractDelegateHook.useContractDelegate,
    )

    // TODO: Can be made more robust by mocking signer instead of this
    mockQueryFilter = jest.fn()
    jest.spyOn(DelegateRegistry, 'getDelegateRegistryContract').mockImplementation(
      jest.fn(() => ({
        queryFilter: mockQueryFilter,
        filters: {
          SetDelegate: jest.fn(() => MOCK_FILTER),
        },
      })) as unknown as typeof DelegateRegistry.getDelegateRegistryContract,
    )

    setIntervalSpy = jest.spyOn(global, 'setInterval')
  })

  it('should invalidate the cache if the filter returns event(s)', async () => {
    mockQueryFilter.mockResolvedValue([{ blockNumber: BASE_BLOCK_NUMBER + 1 }])

    renderHook(() => useContractDelegateInvalidator())

    expect(mockQueryFilter).not.toHaveBeenCalled()
    expect(mockMutate).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(setIntervalSpy).toHaveBeenCalledTimes(1)
    })

    // First interval
    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(mockQueryFilter).toHaveBeenCalledTimes(1)
    expect(mockQueryFilter).toHaveBeenCalledWith(MOCK_FILTER, 0, 'latest')

    // Invalidate cache
    await waitFor(() => {
      expect(mockMutate).toBeCalledTimes(1)
    })
  })

  it('should not invalidate the cache if the filter returns no event(s)', async () => {
    mockQueryFilter.mockResolvedValue([])

    renderHook(() => useContractDelegateInvalidator())

    expect(mockQueryFilter).not.toHaveBeenCalled()
    expect(mockMutate).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(setIntervalSpy).toHaveBeenCalledTimes(1)
    })

    // First interval
    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(mockQueryFilter).toBeCalledTimes(1)
    expect(mockQueryFilter).toHaveBeenCalledWith(MOCK_FILTER, 0, 'latest')

    // Ensure mutation could have happened
    await Promise.resolve()

    // Don't invalidate cache
    expect(mockMutate).not.toHaveBeenCalled()
  })

  it('should not invalidate the cache if the subsequent filter poll returns no event(s)', async () => {
    mockQueryFilter.mockResolvedValue([{ blockNumber: BASE_BLOCK_NUMBER + 1 }])

    renderHook(() => useContractDelegateInvalidator())

    expect(mockQueryFilter).not.toHaveBeenCalled()
    expect(mockMutate).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(setIntervalSpy).toHaveBeenCalledTimes(1)
    })

    // First interval
    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(mockQueryFilter).toBeCalledTimes(1)
    expect(mockQueryFilter).toHaveBeenCalledWith(MOCK_FILTER, BASE_BLOCK_NUMBER, 'latest')

    // Invalidate cache
    await waitFor(() => {
      expect(mockMutate).toBeCalledTimes(1)
    })

    mockQueryFilter.mockResolvedValue([])

    // Second interval
    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(mockQueryFilter).toBeCalledTimes(2)
    expect(mockQueryFilter).toHaveBeenCalledWith(MOCK_FILTER, BASE_BLOCK_NUMBER + 1, 'latest')

    // Ensure second mutation could have happened
    await Promise.resolve()

    // Don't invalidate cache
    expect(mockMutate).toBeCalledTimes(1)
  })
})
