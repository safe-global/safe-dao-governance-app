import useSWRImmutable from 'swr/immutable'

import { AIRDROP_TAGS, VESTING_URL } from '@/config/constants'
import { useAddress } from '@/hooks/useAddress'
import { useChainId } from '@/hooks/useChainId'
import { sameAddress } from '@/utils/addresses'

type Tags = (typeof AIRDROP_TAGS)[keyof typeof AIRDROP_TAGS]

export type Allocation = {
  tag: Tags
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

const MOCK_SEP5_ALLOCATION: Allocation = {
  tag: 'user_v2',
  account: '0x5f310dc66F4ecDE9a1769f1B7D75224dA592201e',
  chainId: 5,
  contract: '0xB1E81Fe4442FA5A0eE38feB7146E547937C6E737',
  vestingId: '0x94a8c37e9cd99e54fd1fc52dac4449e7942fbfbed630ef50a93c8cc17169ad07',
  durationWeeks: 208,
  startDate: 1662026400,
  amount: '0x03bd913e6c1df40000',
  curve: 0,
  proof: [],
}

const fetchAllocation = async (chainId: string, address: string): Promise<Allocation[]> => {
  try {
    const response = await fetch(`${VESTING_URL}/${chainId}/${address}.json`)

    // No file exists => the address is not part of any vesting
    if (response.status === 404) {
      return Promise.resolve([]) as Promise<Allocation[]>
    }

    // Some other error
    if (!response.ok) {
      throw Error(`Error fetching vestings: ${response.statusText}`)
    }

    // Success
    const allocations: Allocation[] = await response.json()

    // TODO: Remove mock allocation when vesting is deployed
    const isCurrentChain = MOCK_SEP5_ALLOCATION.chainId.toString() === chainId
    const isCurrentAddress = sameAddress(MOCK_SEP5_ALLOCATION.account, address)

    if (isCurrentChain && isCurrentAddress) {
      allocations.push(MOCK_SEP5_ALLOCATION)
    }

    return allocations
  } catch (err) {
    throw Error(`Error fetching vestings: ${err}`)
  }
}

export const useAllocations = () => {
  const chainId = useChainId()
  const address = useAddress()

  return useSWRImmutable([chainId, address], () => {
    if (!address) {
      return null
    }
    return fetchAllocation(chainId, address)
  })
}
