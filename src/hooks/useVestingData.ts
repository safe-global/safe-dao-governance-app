import { isPast } from 'date-fns'
import { BigNumber } from 'ethers'
import { defaultAbiCoder } from 'ethers/lib/utils'
import useSWRImmutable from 'swr'
import type { JsonRpcProvider } from '@ethersproject/providers'

import { getAirdropInterface } from '@/services/contracts/Airdrop'
import { VESTING_URL, ZERO_ADDRESS } from '@/config/constants'
import { sameAddress } from '@/utils/addresses'
import { useChainId } from '@/hooks/useChainId'
import { useAddress } from '@/hooks/useAddress'
import { useWeb3 } from '@/hooks/useWeb3'

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

const fetchAllocation = async (chainId: string, address: string): Promise<VestingData[]> => {
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

const airdropInterface = getAirdropInterface()

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
      amountClaimed: decodedVestingData[6].toString(),
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

const getValidVestingAllocation = (allocationData: Vesting[]): Vesting[] => {
  return allocationData.filter(({ isExpired, isRedeemed }) => !isExpired || isRedeemed)
}

export const _getVestingData = async (
  chainId: string,
  address?: string,
  web3?: JsonRpcProvider,
): Promise<Vesting[] | null> => {
  if (!address || !web3) {
    return null
  }

  const vestingData = await fetchAllocation(chainId, address).then((allocations) => {
    return Promise.all(allocations.map((allocation) => completeAllocation(allocation, web3)))
  })

  return getValidVestingAllocation(vestingData)
}

export const useVestingData = () => {
  const QUERY_KEY = 'vesting-data'

  const web3 = useWeb3()
  const chainId = useChainId()
  const address = useAddress()

  return useSWRImmutable(web3 ? [QUERY_KEY, chainId, address] : null, () => _getVestingData(chainId, address, web3))
}
