import { getChainsConfig } from '@safe-global/safe-gateway-typescript-sdk'
import useSWR from 'swr'

export const useChains = () => {
  const QUERY_KEY = 'chains'

  return useSWR([QUERY_KEY], getChainsConfig)
}
