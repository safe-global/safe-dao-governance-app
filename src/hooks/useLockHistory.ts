import { useAddress } from './useAddress'
import useSWRInfinite from 'swr/infinite'
import { useMemo } from 'react'
import { toDaysSinceStart } from '@/utils/date'
import { useChainId } from './useChainId'
import { CHAIN_START_TIMESTAMPS } from '@/config/constants'

type LockingHistoryEntry =
  | {
      eventType: 'LOCKED'
      executionDate: string
      transactionHash: string
      holder: string
      amount: string
      logIndex: string
    }
  | {
      eventType: 'UNLOCKED'
      executionDate: string
      transactionHash: string
      holder: string
      amount: string
      logIndex: string
      unlockIndex: string
    }
  | {
      eventType: 'WITHDRAWN'
      executionDate: string
      transactionHash: string
      holder: string
      amount: string
      logIndex: string
      unlockIndex: string
    }

type LockingHistoryEventPage = {
  count: number
  next: string | null
  previous: string | null
  results: LockingHistoryEntry[]
}

export const useLockHistory = () => {
  const address = useAddress()
  const chainId = useChainId()

  const getKey = useMemo(
    () => (pageIndex: number, previousPageData: LockingHistoryEventPage) => {
      if (!previousPageData) {
        // Load first page
        return `https://safe-client.staging.5afe.dev/v1/locking/${address}/history`
      }
      if (previousPageData && !previousPageData.next) return null // reached the end

      // Load next page
      return `https://safe-client.staging.5afe.dev/v1/locking/${address}/history?cursor=${previousPageData.next}`
    },
    [address],
  )

  const { data } = useSWRInfinite(getKey, async (url: string) => {
    return await fetch(url).then((resp) => {
      if (resp.ok) {
        return resp.json() as Promise<LockingHistoryEventPage>
      } else {
        throw new Error('Error fetching lock history.')
      }
    })
  })

  return useMemo(() => {
    if (data === undefined) {
      return []
    }
    return data.flatMap((entry) => entry.results)
  }, [data])
}
