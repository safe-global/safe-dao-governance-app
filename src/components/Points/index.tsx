import { useCampaignInfo } from '@/hooks/useCampaigns'
import { Grid, Typography, Stack, Box, SvgIcon, Divider, useMediaQuery } from '@mui/material'
import { useMemo, useState } from 'react'
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
import { CampaignTitle } from './CampaignTitle'
import { CampaignPromo } from './CampaignPromo'
import { CampaignDisclaimer } from './CampaignDisclaimer'

const Points = () => {
  const globalCampaignId = useGlobalCampaignId()

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(globalCampaignId)
  const campaign = useCampaignInfo(selectedCampaignId)

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
        <Box ml="auto">
          <ExternalLink href="https://safe.global/pass">{'What is Safe{Pass}'}</ExternalLink>
        </Box>
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
                    {campaign && (
                      <CampaignTitle
                        variant="h5"
                        fontWeight={700}
                        fontSize="24px"
                        campaign={campaign}
                        showDates
                        suppressStatusDot
                      />
                    )}
                    {isGlobalCampaign && (
                      <Typography variant="body2" color="text.secondary">
                        In this view you can see the points total from all currently active campaigns and regular Safe
                        activities.
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
          <CampaignPromo />
          <CampaignInfo campaign={campaign} />
          <CampaignDisclaimer />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <SafePassDisclaimer />
      </Grid>
    </Grid>
  )
}

export default Points
