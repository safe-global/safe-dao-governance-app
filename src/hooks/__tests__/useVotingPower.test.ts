import { hexZeroPad, keccak256, parseEther, toUtf8Bytes } from 'ethers/lib/utils'
import { JsonRpcProvider } from '@ethersproject/providers'
import type { TransactionRequest } from '@ethersproject/abstract-provider'
import type { Deferrable } from '@ethersproject/properties'

import { _getVotingPower } from '@/hooks/useVotingPower'
import { BigNumber } from 'ethers'
import { Vesting } from '../useVestingData'

const SAFE_ADDRESS = '0x0000000000000000000000000000000000000002'

describe('getVotingPower', () => {
  const web3Provider = new JsonRpcProvider()

  const mockCall = jest.fn()

  web3Provider.call = mockCall

  it('should return null if address is undefined', async () => {
    const result = await _getVotingPower({ chainId: 5, web3: web3Provider, vestingData: [] })
    expect(result).toBe(null)
  })

  it('should return null if provider is undefined', async () => {
    const result = await _getVotingPower({ chainId: 5, address: SAFE_ADDRESS, vestingData: [] })
    expect(result).toBe(null)
  })

  it('should return 0 if no contract exists on the given chain', async () => {
    const result = await _getVotingPower({ chainId: 0, address: SAFE_ADDRESS, web3: web3Provider, vestingData: [] })
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

    const result = await _getVotingPower({ chainId: 5, address: SAFE_ADDRESS, web3: web3Provider, vestingData: [] })
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

    const result = await _getVotingPower({ chainId: 5, address: SAFE_ADDRESS, web3: web3Provider, vestingData: [] })
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
      chainId: 5,
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
      chainId: 5,
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
      chainId: 5,
      address: SAFE_ADDRESS,
      web3: web3Provider,
      vestingData: mockAllocation,
    })
    expect(result?.toNumber()).toEqual(0)
  })
})
