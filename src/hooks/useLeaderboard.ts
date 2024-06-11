import { useAddress } from './useAddress'
import useSWR from 'swr'
import { POLLING_INTERVAL } from '@/config/constants'
import { toCursorParam } from '@/utils/gateway'
import { PaginatedResult, useGatewayBaseUrl } from './useGatewayBaseUrl'

export type LockingLeaderboardEntry = {
  holder: string
  position: number
  lockedAmount: string
  unlockedAmount: string
  withdrawnAmount: string
}

export type CampaignLeaderboardEntry = {
  holder: string
  position: number
  boost: string
  totalPoints: number
  totalBoostedPoints: number
}

export const useOwnLockingRank = () => {
  const address = useAddress()
  const gatewayBaseUrl = useGatewayBaseUrl()

  return useSWR(
    address ? `${gatewayBaseUrl}/v1/community/locking/${address}/rank` : null,
    async (url: string | null) => {
      if (!url) {
        return undefined
      }
      return await fetch(url).then((resp) => {
        if (resp.ok) {
          return resp.json() as Promise<LockingLeaderboardEntry>
        } else {
          throw new Error('Error fetching own ranking.')
        }
      })
    },
    { refreshInterval: POLLING_INTERVAL },
  )
}

export const useGlobalLockingLeaderboardPage = (limit: number, offset?: number) => {
  const gatewayBaseUrl = useGatewayBaseUrl()

  const getKey = (limit: number, offset?: number) => {
    // Load next page
    return `${gatewayBaseUrl}/v1/community/locking/leaderboard?${toCursorParam(limit, offset)}`
  }

  const { data } = useSWR(
    getKey(limit, offset),
    async (url: string) => {
      return await fetch(url).then((resp) => {
        if (resp.ok) {
          return resp.json() as Promise<PaginatedResult<LockingLeaderboardEntry>>
        } else {
          throw new Error('Error fetching leaderboard.')
        }
      })
    },
    { refreshInterval: POLLING_INTERVAL },
  )

  return data
}

export const useOwnCampaignRank = (resourceId: string | undefined) => {
  const address = useAddress()
  const gatewayBaseUrl = useGatewayBaseUrl()

  const getKey = (resourceId: string | undefined) => {
    if (!resourceId || !address) {
      return null
    }
    // Load next page
    return `${gatewayBaseUrl}/v1/community/campaigns/${resourceId}/leaderboard/${address}`
  }

  const { data, isLoading } = useSWR(
    getKey(resourceId),
    async (url: string) => {
      return await fetch(url).then((resp) => {
        if (resp.ok) {
          return resp.json() as Promise<CampaignLeaderboardEntry>
        } else {
          throw new Error('Error fetching leaderboard.')
        }
      })
    },
    {
      errorRetryCount: 1,
    },
  )

  return { data, isLoading }
}

export const useGlobalCampaignLeaderboardPage = (resourceId: string | undefined, limit: number, offset?: number) => {
  const gatewayBaseUrl = useGatewayBaseUrl()

  const getKey = (resourceId: string | undefined, limit: number, offset?: number) => {
    if (!resourceId) {
      return null
    }
    // Load next page
    return `${gatewayBaseUrl}/v1/community/campaigns/${resourceId}/leaderboard?${toCursorParam(limit, offset)}`
  }

  const { data } = useSWR(getKey(resourceId, limit, offset), async (url: string) => {
    return await fetch(url).then((resp) => {
      if (resp.ok) {
        return resp.json() as Promise<PaginatedResult<CampaignLeaderboardEntry>>
      } else {
        throw new Error('Error fetching leaderboard.')
      }
    })
  })

  return data
}
