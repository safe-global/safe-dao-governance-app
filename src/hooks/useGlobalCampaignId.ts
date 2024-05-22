import { GLOBAL_CAMPAIGN_IDS } from '@/config/constants'
import { useChainId } from './useChainId'

export const useGlobalCampaignId = () => {
  const chainId = useChainId()
  return GLOBAL_CAMPAIGN_IDS[chainId]
}
