import { defaultAbiCoder, hexZeroPad, keccak256, toUtf8Bytes } from 'ethers/lib/utils'
import { JsonRpcProvider } from '@ethersproject/providers'
import type { TransactionRequest } from '@ethersproject/abstract-provider'
import type { Deferrable } from '@ethersproject/properties'

import { ZERO_ADDRESS } from '@/config/constants'
import { _getVestingData } from '@/hooks/useVestingData'

const SAFE_ADDRESS = '0x0000000000000000000000000000000000000002'

const setupFetchStub =
  (data: unknown, status = 200) =>
  () => {
    return Promise.resolve({
      json: () => Promise.resolve(data),
      status,
      ok: status === 200,
    })
  }

describe('useVestingData', () => {
  const web3Provider = new JsonRpcProvider()

  const mockCall = jest.fn()

  web3Provider.call = mockCall

  afterEach(() => {
    // @ts-expect-error mockClear is not defined in the type definition
    global.fetch?.mockClear?.()
  })

  afterAll(() => {
    // @ts-expect-error shouldn't delete global.fetch
    delete global.fetch
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('return an empty array if no allocations exist', async () => {
    global.fetch = jest.fn().mockImplementation(setupFetchStub('', 404))

    const result = await _getVestingData(5, SAFE_ADDRESS, web3Provider)
    expect(result).toStrictEqual([])
  })

  it('include unredeemed allocations if deadline has not passed', async () => {
    const mockAllocation = [
      {
        tag: 'user',
        account: hexZeroPad('0x2', 20),
        chainId: 1,
        contract: hexZeroPad('0xabc', 20),
        vestingId: hexZeroPad('0x4110', 32),
        durationWeeks: 208,
        startDate: 1657231200,
        amount: '2000',
        curve: 0,
        proof: [],
      },
    ]

    global.fetch = jest.fn().mockImplementation(setupFetchStub(mockAllocation, 200))

    mockCall.mockImplementation((transaction: Deferrable<TransactionRequest>) => {
      const vestingsSigHash = keccak256(toUtf8Bytes('vestings(bytes32)')).slice(0, 10)
      const redeemDeadlineSigHash = keccak256(toUtf8Bytes('redeemDeadline()')).slice(0, 10)

      if (typeof transaction.data === 'string' && transaction.data.startsWith(vestingsSigHash)) {
        return Promise.resolve(
          defaultAbiCoder.encode(
            ['address', 'uint8', 'bool', 'uint16', 'uint64', 'uint128', 'uint128', 'uint64', 'bool'],
            [ZERO_ADDRESS, 0, false, 0, 0, 0, 0, 0, false],
          ),
        )
      }

      if (typeof transaction.data === 'string' && transaction.data.startsWith(redeemDeadlineSigHash)) {
        // 08.Dec 2200
        return Promise.resolve(defaultAbiCoder.encode(['uint64'], [7287610110]))
      }

      return Promise.resolve('0x')
    })

    const result = await _getVestingData(5, SAFE_ADDRESS, web3Provider)
    expect(result).toStrictEqual([
      {
        tag: 'user',
        account: hexZeroPad('0x2', 20),
        chainId: 1,
        contract: hexZeroPad('0xabc', 20),
        vestingId: hexZeroPad('0x4110', 32),
        durationWeeks: 208,
        startDate: 1657231200,
        amount: '2000',
        curve: 0,
        proof: [],
        isExpired: false,
        isRedeemed: false,
        amountClaimed: '0',
      },
    ])
  })

  it('include redeemed allocations if deadline has not passed', async () => {
    const mockAllocation = [
      {
        tag: 'user',
        account: hexZeroPad('0x2', 20),
        chainId: 1,
        contract: hexZeroPad('0xabc', 20),
        vestingId: hexZeroPad('0x4110', 32),
        durationWeeks: 208,
        startDate: 1657231200,
        amount: '2000',
        curve: 0,
        proof: [],
      },
    ]

    global.fetch = jest.fn().mockImplementation(setupFetchStub(mockAllocation, 200))

    mockCall.mockImplementation((transaction: Deferrable<TransactionRequest>) => {
      const vestingsSigHash = keccak256(toUtf8Bytes('vestings(bytes32)')).slice(0, 10)

      if (typeof transaction.data === 'string' && transaction.data.startsWith(vestingsSigHash)) {
        return Promise.resolve(
          defaultAbiCoder.encode(
            ['address', 'uint8', 'bool', 'uint16', 'uint64', 'uint128', 'uint128', 'uint64', 'bool'],
            [hexZeroPad('0x2', 20), '0x1', false, 208, 1657231200, 2000, 2000, 0, false],
          ),
        )
      }

      return Promise.resolve('0x')
    })

    const result = await _getVestingData(5, SAFE_ADDRESS, web3Provider)
    expect(result).toStrictEqual([
      {
        tag: 'user',
        account: hexZeroPad('0x2', 20),
        chainId: 1,
        contract: hexZeroPad('0xabc', 20),
        vestingId: hexZeroPad('0x4110', 32),
        durationWeeks: 208,
        startDate: 1657231200,
        amount: '2000',
        curve: 0,
        proof: [],
        isExpired: false,
        isRedeemed: true,
        amountClaimed: '2000',
      },
    ])
  })

  it('ignore unredeemed allocations if deadline has passed', async () => {
    const mockAllocation = [
      {
        tag: 'user',
        account: hexZeroPad('0x2', 20),
        chainId: 1,
        contract: hexZeroPad('0xabc', 20),
        vestingId: hexZeroPad('0x4110', 32),
        durationWeeks: 208,
        startDate: 1657231200,
        amount: '2000',
        curve: 0,
        proof: [],
      },
    ]

    global.fetch = jest.fn().mockImplementation(setupFetchStub(mockAllocation, 200))

    mockCall.mockImplementation((transaction: Deferrable<TransactionRequest>) => {
      const vestingsSigHash = keccak256(toUtf8Bytes('vestings(bytes32)')).slice(0, 10)
      const redeemDeadlineSigHash = keccak256(toUtf8Bytes('redeemDeadline()')).slice(0, 10)

      if (typeof transaction.data === 'string' && transaction.data.startsWith(vestingsSigHash)) {
        return Promise.resolve(
          defaultAbiCoder.encode(
            ['address', 'uint8', 'bool', 'uint16', 'uint64', 'uint128', 'uint128', 'uint64', 'bool'],
            [ZERO_ADDRESS, 0, false, 0, 0, 0, 0, 0, false],
          ),
        )
      }

      if (typeof transaction.data === 'string' && transaction.data.startsWith(redeemDeadlineSigHash)) {
        // 30th Nov 2022
        return Promise.resolve(defaultAbiCoder.encode(['uint64'], [1669766400]))
      }

      return Promise.resolve('0x')
    })

    const result = await _getVestingData(5, SAFE_ADDRESS, web3Provider)
    expect(result).toStrictEqual([])
  })
})
