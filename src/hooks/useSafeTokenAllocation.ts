import { isPast } from 'date-fns'
import { BigNumber } from 'ethers'
import { defaultAbiCoder } from 'ethers/lib/utils'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import memoize from 'lodash/memoize'
import type { JsonRpcProvider } from '@ethersproject/providers'

import { getAirdropInterface } from '@/services/contracts/Airdrop'
import { POLLING_INTERVAL, ZERO_ADDRESS } from '@/config/constants'
import { sameAddress } from '@/utils/addresses'
import { useWeb3 } from '@/hooks/useWeb3'
import { isDashboard } from '@/utils/routes'
import { Allocation, useAllocations } from '@/hooks/useAllocations'
import { CHAIN_SAFE_TOKEN_ADDRESS } from '@/config/constants'
import { getSafeTokenInterface } from '@/services/contracts/SafeToken'
import { useChainId } from '@/hooks/useChainId'
import { useAddress } from '@/hooks/useAddress'

export type Vesting = Allocation & {
  isExpired: boolean
  isRedeemed: boolean
  amountClaimed: string
}

const airdropInterface = getAirdropInterface()

export const _getRedeemDeadline = memoize(
  async (allocation: Allocation, provider: JsonRpcProvider): Promise<string> => {
    return provider.call({
      to: allocation.contract,
      data: airdropInterface.encodeFunctionData('redeemDeadline'),
    })
  },
  ({ chainId, contract }) => chainId + contract,
)

/**
 * Add on-chain information to allocation.
 * Fetches if the redeem deadline is expired and the claimed tokens from on-chain
 */
const completeAllocation = async (allocation: Allocation, provider: JsonRpcProvider): Promise<Vesting> => {
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
  const redeemDeadline = await _getRedeemDeadline(allocation, provider)

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

export const _getVestingData = async (web3: JsonRpcProvider, allocations: Allocation[]): Promise<Vesting[] | null> => {
  const vestingData = await Promise.all(allocations.map((allocation) => completeAllocation(allocation, web3)))

  return getValidVestingAllocation(vestingData)
}

const tokenInterface = getSafeTokenInterface()

const fetchTokenBalance = async (chainId: string, safeAddress: string, provider: JsonRpcProvider): Promise<string> => {
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
    throw Error(`Error fetching Safe Token balance:  ${err}`)
  }
}

const computeVotingPower = (validVestingData: Vesting[], balance: string): BigNumber => {
  const tokensInVesting = validVestingData.reduce(
    (acc, data) => acc.add(data.amount).sub(data.amountClaimed),
    BigNumber.from(0),
  )

  // add balance
  return tokensInVesting.add(BigNumber.from(balance))
}

export const _getVotingPower = async ({
  chainId,
  address,
  web3,
  vestingData,
}: {
  chainId: string
  address: string
  web3: JsonRpcProvider
  vestingData: Vesting[]
}): Promise<BigNumber> => {
  const balance = await fetchTokenBalance(chainId, address, web3)

  return computeVotingPower(vestingData, balance)
}

const getSafeTokenAllocation = async ({
  chainId,
  address,
  web3,
  allocations,
}: {
  chainId: string
  address?: string
  web3?: JsonRpcProvider
  allocations?: Allocation[]
}): Promise<{ vestingData: Vesting[]; votingPower: BigNumber } | null> => {
  if (!allocations || !web3 || !address) {
    return null
  }

  const vestingData = await _getVestingData(web3, allocations)

  if (!vestingData) {
    return null
  }

  const votingPower = await _getVotingPower({ chainId, address, web3, vestingData })

  return {
    vestingData,
    votingPower,
  }
}

export const useSafeTokenAllocation = () => {
  const { pathname } = useRouter()
  const web3 = useWeb3()
  const chainId = useChainId()
  const address = useAddress()

  const allocations = useAllocations()

  return useSWR(
    web3 ? [allocations.data] : null,
    async () => getSafeTokenAllocation({ chainId, address, web3, allocations: allocations.data ?? [] }),
    {
      refreshInterval: !isDashboard(pathname) ? POLLING_INTERVAL : undefined,
    },
  )
}
