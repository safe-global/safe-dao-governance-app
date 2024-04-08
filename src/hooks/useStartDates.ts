import { CHAIN_START_TIMESTAMPS, SEASON1_START, SEASON2_START } from '@/config/constants'
import { IS_PRODUCTION, Chains } from '@/config/constants'

import { useChainId } from '@/hooks/useChainId'
import { ExternalStore } from '@/services/ExternalStore'
import { useState } from 'react'

export const startDateStore = new ExternalStore(CHAIN_START_TIMESTAMPS[Chains.SEPOLIA])

export const useStartDate = () => {
  const chainId = useChainId()

  const startTime = IS_PRODUCTION ? CHAIN_START_TIMESTAMPS[chainId] : startDateStore.useStore()!

  return { startTime }
}
