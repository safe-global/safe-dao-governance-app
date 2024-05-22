import { PaginatedResult, useGatewayBaseUrl } from './useGatewayBaseUrl'
import useSWR from 'swr'
import { toCursorParam } from '@/utils/gateway'

export type Campaign = {
  resourceId: string
  name: string
  description: string
  startDate: string
  endDate: string
  lastUpdated: string
  activitiesMetadata: {
    resourceId: string
    name: string
    description: string
    maxPoints: string
  }[]
}

export const useCampaignPage = (limit: number, offset?: number) => {
  const gatewayBaseUrl = useGatewayBaseUrl()

  const getKey = (limit: number, offset?: number) => {
    // Load next page
    return `${gatewayBaseUrl}/v1/community/campaigns?${toCursorParam(limit, offset)}`
  }

  const { data } = useSWR(getKey(limit, offset), async (url: string) => {
    return await fetch(url).then((resp) => {
      if (resp.ok) {
        return resp.json() as Promise<PaginatedResult<Campaign>>
      } else {
        throw new Error('Error fetching campaigns.')
      }
    })
  })

  return data
}

export const useCampaignInfo = (resourceId: string) => {
  const gatewayBaseUrl = useGatewayBaseUrl()

  const getKey = (resourceId: string) => {
    // Load next page
    return `${gatewayBaseUrl}/v1/community/campaigns/${resourceId}`
  }

  const { data } = useSWR(getKey(resourceId), async (url: string) => {
    return await fetch(url).then((resp) => {
      if (resp.ok) {
        return resp.json() as Promise<Campaign>
      } else {
        throw new Error('Error fetching campaigns.')
      }
    })
  })

  return data
}
