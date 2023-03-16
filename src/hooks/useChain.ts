import { getChainsConfig } from '@safe-global/safe-gateway-typescript-sdk'
import useSWR from 'swr'

import { useChainId } from '@/hooks/useChainId'

export const useChain = () => {
  const QUERY_KEY = 'chains'
  const chainId = useChainId()

  const { data: chains } = useSWR([QUERY_KEY], getChainsConfig)

  return chains?.results?.find((chain) => chain.chainId === chainId.toString())
}
