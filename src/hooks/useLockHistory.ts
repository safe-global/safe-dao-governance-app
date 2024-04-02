import { useAddress } from './useAddress'
import useSWRInfinite from 'swr/infinite'
import { useMemo } from 'react'
import { CGW_BASE_URL, POLLING_INTERVAL } from '@/config/constants'
import { toCursorParam } from '@/utils/gateway'

export type LockEvent = {
  eventType: 'LOCKED'
  executionDate: string
  transactionHash: string
  holder: string
  amount: string
  logIndex: string
}

export type UnlockEvent = {
  eventType: 'UNLOCKED'
  executionDate: string
  transactionHash: string
  holder: string
  amount: string
  logIndex: string
  unlockIndex: string
}

export type WithdrawEvent = {
  eventType: 'WITHDRAWN'
  executionDate: string
  transactionHash: string
  holder: string
  amount: string
  logIndex: string
  unlockIndex: string
}

export type LockingHistoryEntry = LockEvent | UnlockEvent | WithdrawEvent

type LockingHistoryEventPage = {
  count: number
  next: string | null
  previous: string | null
  results: LockingHistoryEntry[]
}

const LIMIT = 100

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
        return `${CGW_BASE_URL}/v1/locking/${address}/history?${toCursorParam(LIMIT)}`
      }
      if (previousPageData && !previousPageData.next) return null // reached the end

      // Load next page
      return previousPageData.next
    },
    [address],
  )

  const { data, size, setSize } = useSWRInfinite(
    getKey,
    async (url: string) => {
      return await fetch(url).then((resp) => {
        if (resp.ok) {
          return resp.json() as Promise<LockingHistoryEventPage>
        } else {
          throw new Error('Error fetching lock history.')
        }
      })
    },
    {
      refreshInterval: POLLING_INTERVAL,
    },
  )

  // We need to load everything
  if (data && data.length > 0) {
    const totalPages = Math.ceil(data[0].count / LIMIT)
    if (totalPages > size) {
      setSize(Math.ceil(data[0].count / LIMIT))
    }
  }

  return useMemo(() => {
    if (data === undefined) {
      return []
    }
    return data.flatMap((entry) => entry.results)
  }, [data])
}
