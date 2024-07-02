import { PaginatedResult, useGatewayBaseUrl } from './useGatewayBaseUrl'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

import { toCursorParam } from '@/utils/gateway'
import { useCallback, useMemo } from 'react'

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

const PAGE_SIZE = 5

export const useCampaignsPaginated = () => {
  const gatewayBaseUrl = useGatewayBaseUrl()

  const getKey = (pageIndex: number, previousPageData: PaginatedResult<Campaign>) => {
    if (!previousPageData) {
      // First load
      return `${gatewayBaseUrl}/v1/community/campaigns?${toCursorParam(PAGE_SIZE)}`
    }

    // reached the end
    if (previousPageData && !previousPageData.next) return null

    // Load next page
    return previousPageData.next
  }

  const { data, setSize, size } = useSWRInfinite(getKey, async (url: string) => {
    return await fetch(url).then((resp) => {
      if (resp.ok) {
        return resp.json() as Promise<PaginatedResult<Campaign>>
      } else {
        throw new Error('Error fetching campaigns.')
      }
    })
  })

  const flatData = useMemo(() => data?.flatMap((part) => part.results), [data])
  const loadMore = useCallback(() => setSize((prev) => prev + PAGE_SIZE), [setSize])
  const hasMore = useMemo(() => (data?.[0]?.count ?? 0) > size, [data, size])

  return {
    data: flatData,
    loadMore,
    hasMore,
  }
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
