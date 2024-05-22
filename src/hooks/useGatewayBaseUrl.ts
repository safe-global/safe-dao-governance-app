import { CGW_BASE_URL } from '@/config/constants'
import { useChainId } from '@/hooks/useChainId'

export type PaginatedResult<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export const useGatewayBaseUrl = (): string => {
  const chainId = useChainId()

  return CGW_BASE_URL[chainId]
}
