import { CGW_BASE_URL, _DEFAULT_CHAIN_ID } from '@/config/constants'
import { useChainId } from '@/hooks/useChainId'

export const useGatewayBaseUrl = (): string => {
  const chainId = useChainId()

  return CGW_BASE_URL[chainId]
}
