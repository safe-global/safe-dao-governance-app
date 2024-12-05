import { AGGREGATE_CAMPAIGN_IDS } from '@/config/constants'
import { useChainId } from './useChainId'

export const useAggregateCampaignId = () => {
  const chainId = useChainId()
  return AGGREGATE_CAMPAIGN_IDS[chainId]
}
