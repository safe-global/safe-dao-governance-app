import { useAddress } from './useAddress'
import { PaginatedResult, useGatewayBaseUrl } from './useGatewayBaseUrl'
import useSWR from 'swr'
import { useMemo } from 'react'

type CampaignUpdate = {
  startDate: string
  endDate: string
  holder: string
  boost: number
  totalPoints: number
  totalBoostedPoints: number
}

export const useLatestCampaignUpdate = (resourceId: string | undefined) => {
  const address = useAddress()
  const gatewayBaseUrl = useGatewayBaseUrl()

  const getKey = (resourceId: string | undefined) => {
    if (!resourceId || !address) {
      return null
    }
    // Load newest page only
    return `${gatewayBaseUrl}/v1/community/campaigns/${resourceId}/activities/?holder=${address}`
  }

  const { data, isLoading } = useSWR(
    getKey(resourceId),
    async (url: string) => {
      return await fetch(url).then((resp) => {
        if (resp.ok) {
          return resp.json() as Promise<PaginatedResult<CampaignUpdate>>
        } else {
          throw new Error('Error fetching campaign update.')
        }
      })
    },
    {
      errorRetryCount: 0,
    },
  )

  // Only return newest entry
  const newestUpdate = useMemo(() => {
    if (data && data.results.length > 0) {
      return data.results[0]
    }
  }, [data])

  return { data: newestUpdate, isLoading }
}
