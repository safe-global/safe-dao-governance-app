import { useAddress } from './useAddress'
import useSWR from 'swr'
import { useMemo } from 'react'
import { CGW_BASE_URL } from '@/config/constants'
import { toCursorParam } from '@/utils/gateway'

type LeaderboardEntry = {
  holder: string
  position: number
  lockedAmount: string
  unlockedAmount: string
  withdrawnAmount: string
}

type LeaderboardPage = {
  count: number
  next: string | null
  previous: string | null
  results: LeaderboardEntry[]
}

export const useOwnRank = () => {
  const address = useAddress()

  return useSWR(
    address ? `${CGW_BASE_URL}/v1/locking/leaderboard/rank/${address}` : null,
    async (url: string | null) => {
      if (!url) {
        return undefined
      }
      return await fetch(url).then((resp) => {
        if (resp.ok) {
          return resp.json() as Promise<LeaderboardEntry>
        } else {
          throw new Error('Error fetching own ranking.')
        }
      })
    },
  )
}

export const useGlobalLeaderboardPage = (limit: number, offset?: number) => {
  const getKey = (limit: number, offset?: number) => {
    if (!offset) {
      // Load first page
      return `${CGW_BASE_URL}/v1/locking/leaderboard?${toCursorParam(limit)}`
    }

    // Load next page
    return `${CGW_BASE_URL}/v1/locking/leaderboard?${toCursorParam(limit, offset)}`
  }

  const { data } = useSWR(getKey(limit, offset), async (url: string) => {
    return await fetch(url).then((resp) => {
      if (resp.ok) {
        return resp.json() as Promise<LeaderboardPage>
      } else {
        throw new Error('Error fetching leaderboard.')
      }
    })
  })

  return data
}
