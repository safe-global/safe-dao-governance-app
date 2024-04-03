import { useAddress } from './useAddress'
import useSWR from 'swr'
import { POLLING_INTERVAL } from '@/config/constants'
import { toCursorParam } from '@/utils/gateway'
import { useGatewayBaseUrl } from './useGatewayBaseUrl'

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
  const gatewayBaseUrl = useGatewayBaseUrl()

  return useSWR(
    address ? `${gatewayBaseUrl}/v1/locking/leaderboard/rank/${address}` : null,
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
    { refreshInterval: POLLING_INTERVAL },
  )
}

export const useGlobalLeaderboardPage = (limit: number, offset?: number) => {
  const gatewayBaseUrl = useGatewayBaseUrl()

  const getKey = (limit: number, offset?: number) => {
    if (!offset) {
      // Load first page
      return `${gatewayBaseUrl}/v1/locking/leaderboard?${toCursorParam(limit)}`
    }

    // Load next page
    return `${gatewayBaseUrl}/v1/locking/leaderboard?${toCursorParam(limit, offset)}`
  }

  const { data } = useSWR(
    getKey(limit, offset),
    async (url: string) => {
      return await fetch(url).then((resp) => {
        if (resp.ok) {
          return resp.json() as Promise<LeaderboardPage>
        } else {
          throw new Error('Error fetching leaderboard.')
        }
      })
    },
    { refreshInterval: POLLING_INTERVAL },
  )

  return data
}
