import { JsonRpcProvider, TransactionRequest } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import { hexZeroPad, Deferrable, keccak256, toUtf8Bytes, defaultAbiCoder, parseEther } from 'ethers/lib/utils'

import { ZERO_ADDRESS } from '@/config/constants'
import { _getRedeemDeadline, _getVestingData, _getVotingPower } from '@/hooks/useSafeTokenAllocation'
import type { Vesting } from '@/hooks/useSafeTokenAllocation'
import type { Allocation } from '@/hooks/useAllocations'

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

describe('useSafeTokenAllocation', () => {
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

    // Clear memoization cache
    _getRedeemDeadline.cache.clear?.()
  })

  describe('_getRedeemDeadline', () => {
    it('should should only call the provider once per address on a chain', async () => {
      for await (const _ of Array.from({ length: 10 })) {
        await _getRedeemDeadline({ chainId: 1, contract: hexZeroPad('0x1', 20) } as Allocation, web3Provider)
      }

      expect(web3Provider.call).toHaveBeenCalledTimes(1)
    })

    it('should not memoize different addresses on the same chain', async () => {
      const chainId = 1

      await _getRedeemDeadline({ chainId, contract: hexZeroPad('0x1', 20) } as Allocation, web3Provider)
      await _getRedeemDeadline({ chainId, contract: hexZeroPad('0x2', 20) } as Allocation, web3Provider)

      expect(web3Provider.call).toHaveBeenCalledTimes(2)
    })

    it('should not memoize the same address on difference chains', async () => {
      for await (const i of Array.from({ length: 10 }, (_, i) => i + 1)) {
        await _getRedeemDeadline({ chainId: i, contract: hexZeroPad('0x1', 20) } as Allocation, web3Provider)
      }

      expect(web3Provider.call).toHaveBeenCalledTimes(10)
    })
  })

  describe('_getVestingData', () => {
    it('include unredeemed allocations if deadline has not passed', async () => {
      const mockAllocation: Allocation[] = [
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

      const result = await _getVestingData(web3Provider, mockAllocation)
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
      const mockAllocation: Allocation[] = [
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

      const result = await _getVestingData(web3Provider, mockAllocation)
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
      const mockAllocation: Allocation[] = [
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

      const result = await _getVestingData(web3Provider, mockAllocation)
      expect(result).toStrictEqual([])
    })
  })

  describe('_getVotingPower', () => {
    it('should return 0 if no contract exists on the given chain', async () => {
      const result = await _getVotingPower({ chainId: '0', address: SAFE_ADDRESS, web3: web3Provider, vestingData: [] })
      expect(result?.toNumber()).toEqual(0)
    })

    it('return 0 if no balances / vestings exist', async () => {
      mockCall.mockImplementation((transaction: Deferrable<TransactionRequest>) => {
        const sigHash = keccak256(toUtf8Bytes('balanceOf(address)')).slice(0, 10)
        if (typeof transaction.data === 'string' && transaction.data.startsWith(sigHash)) {
          return Promise.resolve('0x0')
        }
        return Promise.resolve('0x')
      })

      const result = await _getVotingPower({ chainId: '5', address: SAFE_ADDRESS, web3: web3Provider, vestingData: [] })
      expect(result?.toNumber()).toEqual(0)
    })

    it('return balance if no vestings exists', async () => {
      mockCall.mockImplementation((transaction: Deferrable<TransactionRequest>) => {
        const sigHash = keccak256(toUtf8Bytes('balanceOf(address)')).slice(0, 10)
        if (typeof transaction.data === 'string' && transaction.data.startsWith(sigHash)) {
          return Promise.resolve(parseEther('100').toHexString())
        }
        return Promise.resolve('0x')
      })

      const result = await _getVotingPower({ chainId: '5', address: SAFE_ADDRESS, web3: web3Provider, vestingData: [] })
      expect(result?.eq(parseEther('100'))).toBeTruthy()
    })

    it('include unredeemed allocations if deadline has not passed', async () => {
      const mockVestings: Vesting[] = [
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
      ]

      mockCall.mockImplementation((transaction: Deferrable<TransactionRequest>) => {
        const balanceOfSigHash = keccak256(toUtf8Bytes('balanceOf(address)')).slice(0, 10)

        if (typeof transaction.data === 'string' && transaction.data.startsWith(balanceOfSigHash)) {
          return Promise.resolve(parseEther('0').toHexString())
        }

        return Promise.resolve('0x')
      })

      const result = await _getVotingPower({
        chainId: '5',
        address: SAFE_ADDRESS,
        web3: web3Provider,
        vestingData: mockVestings,
      })
      expect(result?.toNumber()).toEqual(2000)
    })

    it('include redeemed allocations if deadline has not passed', async () => {
      const mockAllocation: Vesting[] = [
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
      ]

      mockCall.mockImplementation((transaction: Deferrable<TransactionRequest>) => {
        const balanceOfSigHash = keccak256(toUtf8Bytes('balanceOf(address)')).slice(0, 10)

        if (typeof transaction.data === 'string' && transaction.data.startsWith(balanceOfSigHash)) {
          return Promise.resolve(BigNumber.from('2000').toHexString())
        }

        return Promise.resolve('0x')
      })

      const result = await _getVotingPower({
        chainId: '5',
        address: SAFE_ADDRESS,
        web3: web3Provider,
        vestingData: mockAllocation,
      })
      expect(result?.toNumber()).toEqual(2000)
    })

    it('test formula: allocation - claimed + balance, everything claimed and no balance', async () => {
      const mockAllocation: Vesting[] = [
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
      ]

      mockCall.mockImplementation((transaction: Deferrable<TransactionRequest>) => {
        const balanceOfSigHash = keccak256(toUtf8Bytes('balanceOf(address)')).slice(0, 10)

        if (typeof transaction.data === 'string' && transaction.data.startsWith(balanceOfSigHash)) {
          return Promise.resolve(BigNumber.from('0').toHexString())
        }

        return Promise.resolve('0x')
      })

      const result = await _getVotingPower({
        chainId: '5',
        address: SAFE_ADDRESS,
        web3: web3Provider,
        vestingData: mockAllocation,
      })
      expect(result?.toNumber()).toEqual(0)
    })
  })
})
