import { CGW_BASE_URL } from '@/config/constants'
import { useChainId } from '@/hooks/useChainId'

export const useGatewayBaseUrl = (): string => {
  const chainId = useChainId()

  return CGW_BASE_URL[chainId]
}
