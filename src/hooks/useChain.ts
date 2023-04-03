import { getChainsConfig } from '@safe-global/safe-gateway-typescript-sdk'
import useSWRImmutable from 'swr/immutable'

import { useChainId } from '@/hooks/useChainId'

export const useChain = () => {
  const QUERY_KEY = 'chains'
  const chainId = useChainId()

  const { data: chains } = useSWRImmutable([QUERY_KEY], getChainsConfig)

  return chains?.results?.find((chain) => chain.chainId === chainId)
}
