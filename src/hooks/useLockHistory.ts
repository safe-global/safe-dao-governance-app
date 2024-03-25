import { useAddress } from './useAddress'
import useSWRInfinite from 'swr/infinite'
import { useMemo } from 'react'
import { CGW_BASE_URL } from '@/config/constants'
import { toCursorParam } from '@/utils/gateway'

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

  const getKey = useMemo(
    () => (pageIndex: number, previousPageData: LockingHistoryEventPage) => {
      if (!address) {
        // We cannot fetch data while the address is resolving
        return null
      }
      if (!previousPageData) {
        // Load first page
        return `${CGW_BASE_URL}/v1/locking/${address}/history`
      }
      if (previousPageData && !previousPageData.next) return null // reached the end

      // Load next page
      return previousPageData.next
    },
    [address],
  )

  const { data, size, setSize } = useSWRInfinite(getKey, async (url: string) => {
    return await fetch(url).then((resp) => {
      if (resp.ok) {
        return resp.json() as Promise<LockingHistoryEventPage>
      } else {
        throw new Error('Error fetching lock history.')
      }
    })
  })

  // We need to load everything
  if (data && data.length > 0) {
    const totalPages = Math.ceil(data[0].count / 100)
    if (totalPages > size) {
      setSize(Math.ceil(data[0].count / 100))
    }
  }

  return useMemo(() => {
    if (data === undefined) {
      return []
    }
    return data.flatMap((entry) => entry.results)
  }, [data])
}
