import { GLOBAL_CAMPAIGN_IDS } from '@/config/constants'
import { useCampaignPage } from '@/hooks/useCampaigns'
import { useChainId } from '@/hooks/useChainId'
import { Grid, Typography, Stack, Box, SvgIcon, Divider, useMediaQuery } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { ExternalLink } from '../ExternalLink'
import PaperContainer from '../PaperContainer'
import SafePassDisclaimer from '../SafePassDisclaimer'
import { ActivityPointsFeed } from './ActivityPointsFeed'
import { CampaignInfo } from './CampaignInfo'
import { CampaignLeaderboard } from './CampaignLeaderboard'
import CampaignTabs from './CampaignTabs'
import StarIcon from '@/public/images/leaderboard-title-star.svg'
import css from './styles.module.css'
import { TotalPoints } from './TotalPoints'
import { useTheme } from '@mui/material/styles'
import { useGlobalCampaignId } from '@/hooks/useGlobalCampaignId'

const Points = () => {
  const campaignPage = useCampaignPage(20)

  const chainId = useChainId()

  const globalCampaignId = useGlobalCampaignId()

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(GLOBAL_CAMPAIGN_IDS[chainId])
  const campaign = campaignPage?.results.find((c) => c.resourceId === selectedCampaignId)

  useEffect(() => {
    setSelectedCampaignId(GLOBAL_CAMPAIGN_IDS[chainId])
  }, [chainId])

  const isGlobalCampaign = useMemo(
    () => globalCampaignId === selectedCampaignId,
    [globalCampaignId, selectedCampaignId],
  )
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'))

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
          {isSmallScreen && <TotalPoints />}
          <PaperContainer>
            <Stack direction="row" spacing={2} mb={2}>
              {!isSmallScreen && <SvgIcon component={StarIcon} inheritViewBox sx={{ width: '27px', height: '27px' }} />}
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={700} fontSize="24px">
                  Points activity feed
                </Typography>

                {!isSmallScreen && (
                  <Typography variant="body2" color="text.secondary">
                    Earn points by engaging with Safe and our campaign partners. Depending on the campaign, you&apos;ll
                    be rewarded for various activities suggested by our partners. You can also earn points for regular
                    Safe activities.
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Divider />
            <Stack direction={{ lg: 'row', md: 'column' }} spacing={4}>
              <CampaignTabs onChange={setSelectedCampaignId} selectedCampaignId={selectedCampaignId} />
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
                    <Typography variant="h6" fontWeight={700} fontSize="20px">
                      {isGlobalCampaign ? 'Global' : campaign?.name}
                    </Typography>
                    {isGlobalCampaign && (
                      <Typography variant="body2" color="text.secondary">
                        At this view you can see a total of points from all currently active campaigns and Regular Safe
                        Activities.
                      </Typography>
                    )}
                  </Box>
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
          {!isSmallScreen && <TotalPoints />}
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
