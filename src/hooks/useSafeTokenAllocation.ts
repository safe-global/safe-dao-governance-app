import { isPast } from 'date-fns'
import { BigNumber } from 'ethers'
import { defaultAbiCoder, hexZeroPad } from 'ethers/lib/utils'
import useSWR from 'swr'
import { useEffect } from 'react'
import type { EventFilter } from '@ethersproject/abstract-provider'
import type { JsonRpcProvider } from '@ethersproject/providers'

import { getAirdropInterface } from '@/services/contracts/Airdrop'
import { getSafeTokenInterface } from '@/services/contracts/SafeToken'
import { CHAIN_SAFE_TOKEN_ADDRESS, VESTING_URL, ZERO_ADDRESS } from '@/config/constants'
import { useWeb3 } from '@/hooks/useWeb3'
import { sameAddress } from '@/utils/addresses'
import { useWallet } from '@/hooks/useWallet'

type VestingData = {
  tag: 'user' | 'ecosystem' | 'investor'
  account: string
  chainId: number
  contract: string
  vestingId: string
  durationWeeks: number
  startDate: number
  amount: string
  curve: 0 | 1
  proof: string[]
}

export type Vesting = VestingData & {
  isExpired: boolean
  isRedeemed: boolean
  amountClaimed: string
}

const airdropInterface = getAirdropInterface()
const tokenInterface = getSafeTokenInterface()

/**
 * Add on-chain information to allocation.
 * Fetches if the redeem deadline is expired and the claimed tokens from on-chain
 */
const completeAllocation = async (allocation: VestingData, provider: JsonRpcProvider): Promise<Vesting> => {
  const onChainVestingData = await provider.call({
    to: allocation.contract,
    data: airdropInterface.encodeFunctionData('vestings', [allocation.vestingId]),
  })

  const decodedVestingData = defaultAbiCoder.decode(
    // account, curveType, managed, durationWeeks, startDate, amount, amountClaimed, pausingDate, cancelled
    ['address', 'uint8', 'bool', 'uint16', 'uint64', 'uint128', 'uint128', 'uint64', 'bool'],
    onChainVestingData,
  )

  const isRedeemed = !sameAddress(decodedVestingData[0], ZERO_ADDRESS)

  if (isRedeemed) {
    return {
      ...allocation,
      isRedeemed,
      isExpired: false,
      amountClaimed: decodedVestingData[6],
    }
  }

  // Allocation is not yet redeemed => check the redeemDeadline
  const redeemDeadline = await provider.call({
    to: allocation.contract,
    data: airdropInterface.encodeFunctionData('redeemDeadline'),
  })

  const redeemDeadlineDate = new Date(BigNumber.from(redeemDeadline).mul(1000).toNumber())

  // Allocation is valid if redeem deadline is in future
  return {
    ...allocation,
    isRedeemed,
    isExpired: isPast(redeemDeadlineDate),
    amountClaimed: '0',
  }
}

const fetchAllocation = async (chainId: number, address: string): Promise<VestingData[]> => {
  try {
    const response = await fetch(`${VESTING_URL}/${chainId}/${address}.json`)

    // No file exists => the address is not part of any vesting
    if (response.status === 404) {
      return Promise.resolve([]) as Promise<VestingData[]>
    }

    // Some other error
    if (!response.ok) {
      throw Error(`Error fetching vestings: ${response.statusText}`)
    }

    // Success
    return response.json() as Promise<VestingData[]>
  } catch (err) {
    throw Error(`Error fetching vestings: ${err}`)
  }
}

const fetchTokenBalance = async (chainId: number, safeAddress: string, provider: JsonRpcProvider): Promise<string> => {
  const safeTokenAddress = CHAIN_SAFE_TOKEN_ADDRESS[chainId]

  if (!safeTokenAddress) {
    return '0'
  }

  try {
    return await provider.call({
      to: safeTokenAddress,
      data: tokenInterface.encodeFunctionData('balanceOf', [safeAddress]),
    })
  } catch (err) {
    throw Error(`Error fetching Safe token balance:  ${err}`)
  }
}

const getValidVestingAllocation = (allocationData: Vesting[]) => {
  return allocationData.filter(({ isExpired, isRedeemed }) => !isExpired || isRedeemed)
}

const computeVotingPower = (validVestingData: Vesting[], balance: string) => {
  const tokensInVesting = validVestingData.reduce(
    (acc, data) => acc.add(data.amount).sub(data.amountClaimed),
    BigNumber.from(0),
  )

  // add balance
  return tokensInVesting.add(balance || '0')
}

export const _getSafeTokenAllocation = async (
  web3?: JsonRpcProvider,
): Promise<{
  votingPower: BigNumber
  vestingData: Vesting[]
} | null> => {
  if (!web3) {
    return null
  }

  const signer = web3.getSigner()
  const address = await signer.getAddress()

  const signerChainId = await signer.getChainId()

  const vestingData = await fetchAllocation(signerChainId, address).then((allocations) => {
    return Promise.all(allocations.map((allocation) => completeAllocation(allocation, web3)))
  })

  const validVestingData = getValidVestingAllocation(vestingData)

  const balance = await fetchTokenBalance(signerChainId, address, web3)

  const votingPower = computeVotingPower(validVestingData, balance)

  return {
    votingPower,
    vestingData: validVestingData,
  }
}
/**
 * Fetches allocated tokens and combines it with the on-chain status of the vesting.
 */
export const useSafeTokenAllocation = () => {
  const QUERY_KEY = 'safeTokenAllocation'

  const web3 = useWeb3()
  const wallet = useWallet()

  return useSWR(web3 ? [QUERY_KEY, ...(wallet ? [wallet.address, wallet.chainId] : [])] : null, () =>
    _getSafeTokenAllocation(web3),
  )
}

const safeTokenInterface = getSafeTokenInterface()
const transferEvent = safeTokenInterface.getEventTopic(safeTokenInterface.events['Transfer(address,address,uint256)'])

export const useSafeTokenTransferInvalidator = () => {
  const web3 = useWeb3()
  const { mutate } = useSafeTokenAllocation()

  useEffect(() => {
    if (!web3) {
      return
    }

    const filters: EventFilter[] = []

    ;(async () => {
      const signer = web3.getSigner()

      const address = await signer.getAddress()
      const signerChainId = await signer.getChainId()

      const safeTokenAddress = CHAIN_SAFE_TOKEN_ADDRESS[signerChainId]

      if (!safeTokenAddress) {
        return
      }

      // Transfers _from_ signer
      const fromFilter = {
        address: safeTokenAddress,
        // Each topic has to be 32 bytes
        topics: [transferEvent, hexZeroPad(address, 32)],
      }

      // Transfers _to_ signer
      const toFilter = {
        address: safeTokenAddress,
        // Each topic has to be 32 bytes
        topics: [transferEvent, null, hexZeroPad(address, 32)],
      }

      filters.push(fromFilter, toFilter)

      filters.forEach((filter) => {
        web3.on(filter, mutate)
      })
    })()

    return () => {
      filters.forEach((filter) => web3.off(filter))
    }
  }, [web3, mutate])
}
