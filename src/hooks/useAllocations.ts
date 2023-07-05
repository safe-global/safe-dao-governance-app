import useSWRImmutable from 'swr/immutable'

import { AIRDROP_TAGS, Chains, VESTING_URL } from '@/config/constants'
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
    if (chainId === Chains.GOERLI) {
      try {
        const mockAllocations = require(`./mock-claiming-data/${chainId}/${address}.json`)

        const mockSep5Allocation = mockAllocations.find((allocation: Allocation) => {
          return (
            allocation.tag === AIRDROP_TAGS.SEP5 &&
            allocation.chainId.toString() === chainId &&
            sameAddress(allocation.account, address)
          )
        })

        if (mockSep5Allocation) {
          allocations.push(mockSep5Allocation)
        }
      } catch {}
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
