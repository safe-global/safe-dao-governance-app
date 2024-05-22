import { GLOBAL_CAMPAIGN_IDS } from '@/config/constants'
import { useCampaignInfo, useCampaignPage } from '@/hooks/useCampaigns'
import { useChainId } from '@/hooks/useChainId'
import { Grid, Typography, Stack, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { ExternalLink } from '../ExternalLink'
import PaperContainer from '../PaperContainer'
import SafePassDisclaimer from '../SafePassDisclaimer'
import { ActivityPointsFeed } from './ActivityPointsFeed'
import { CampaignInfo } from './CampaignInfo'
import { CampaignLeaderboard } from './CampaignLeaderboard'
import { CampaignSelector } from './CampaignSelector'
import CampaignTabs from './CampaignTabs'
import css from './styles.module.css'

const Points = () => {
  const campaignPage = useCampaignPage(20)

  const chainId = useChainId()

  const globalCampaign = useCampaignInfo(GLOBAL_CAMPAIGN_IDS[chainId])

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(GLOBAL_CAMPAIGN_IDS[chainId])
  const campaign = campaignPage?.results.find((c) => c.resourceId === selectedCampaignId)

  const campaigns = campaignPage?.results ?? []

  const [selectedTab, setSelectedTab] = useState(0)

  useEffect(() => {
    setSelectedCampaignId(GLOBAL_CAMPAIGN_IDS[chainId])
  }, [chainId])

  const onTabChange = (index: number) => {
    setSelectedTab(index)
    if (index === 1) {
      setSelectedCampaignId(campaignPage?.results[1]?.resourceId ?? '')
    }
    if (index === 0) {
      setSelectedCampaignId(globalCampaign?.resourceId ?? '')
    }
  }

  return (
    <Grid container spacing={3} direction="row">
      <Grid item xs={12} mt={4} mb={1} className={css.pageTitle} display="flex" flexDirection="row" alignItems="center">
        <Typography variant="h2">{'Get rewards with Safe{Pass}'}</Typography>
        <ExternalLink href="https://safe.global/pass" ml="auto">
          {'What is Safe{Pass}'}
        </ExternalLink>
      </Grid>

      <Grid item xs={12} lg={8}>
        <Stack spacing={3}>
          <PaperContainer>
            <Stack direction={{ lg: 'row', md: 'column' }} spacing={3}>
              <CampaignTabs onChange={onTabChange} selectedTabIdx={selectedTab} />
              <Box width="100%">
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                  mb={2}
                  minHeight="60px"
                >
                  <Box width="100%">
                    <Typography variant="h5" fontWeight={700}>
                      Points activity feed
                    </Typography>
                    <Typography variant="subtitle2">Your points are updated weekly.</Typography>
                  </Box>
                  {selectedTab > 0 && (
                    <CampaignSelector
                      selectedCampaignId={selectedCampaignId}
                      campaigns={campaigns.slice(1)}
                      setSelectedCampaignId={setSelectedCampaignId}
                    />
                  )}
                </Stack>
                <ActivityPointsFeed campaign={campaign} />
              </Box>
            </Stack>
          </PaperContainer>
          <PaperContainer>
            <CampaignLeaderboard campaign={campaign} />
          </PaperContainer>
        </Stack>
      </Grid>
      <Grid item xs={12} lg={4}>
        <Stack spacing={3} justifyContent="stretch" height="100%">
          <CampaignInfo campaign={campaign} />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <SafePassDisclaimer />
      </Grid>
    </Grid>
  )
}

export default Points
