import { Grid, Typography, Stack, Box, Button, SvgIcon } from '@mui/material'
import { ExternalLink } from '../ExternalLink'
import PaperContainer from '../PaperContainer'
import SafePassDisclaimer from '../SafePassDisclaimer'
import css from './styles.module.css'
import { useGlobalCampaignId } from '@/hooks/useGlobalCampaignId'
import { useOwnCampaignRank } from '@/hooks/useLeaderboard'
import PointsCounter from '@/components/PointsCounter'
import SafeToken from '@/public/images/token.svg'
import { useTaggedAllocations } from '@/hooks/useTaggedAllocations'
import { formatEther } from 'ethers/lib/utils'
import Spotlight from '@/public/images/spotlight.svg'
import Star from '@/public/images/star.svg'
import Star1 from '@/public/images/star1.svg'
import { useCampaignsPaginated } from '@/hooks/useCampaigns'
import { useCoolMode } from '@/hooks/useCoolMode'

const Points = () => {
  const { data: campaigns = [] } = useCampaignsPaginated()
  const globalCampaignId = useGlobalCampaignId()
  const { data: globalRank } = useOwnCampaignRank(globalCampaignId)
  const { sapBoosted, sapUnboosted, totalSAP } = useTaggedAllocations()
  const particlesRef = useCoolMode('./images/token.svg')

  return (
    <>
      <Grid container spacing={3} direction="row">
        <Grid
          item
          xs={12}
          mt={4}
          mb={4}
          className={css.pageTitle}
          display="flex"
          flexDirection="row"
          alignItems="flex-end"
        >
          <Typography variant="h1">{'Get your Safe{Pass} rewards'}</Typography>
          <Box ml="auto">
            <ExternalLink href="https://safe.global/pass">{'What is Safe{Pass}'}</ExternalLink>
          </Box>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item>
          <PaperContainer
            sx={{
              height: 1,
              justifyContent: 'center',
              background: 'linear-gradient(180deg, #B0FFC9 0%, #D7F6FF 99.5%)',
              color: 'static.main',
            }}
          >
            <Grid container>
              <Grid item xs={12} lg={7}>
                <Stack gap={2} alignItems="flex-start" p={4}>
                  <Typography variant="h3" fontWeight={700} fontSize="32px">
                    Rewards Await! 🏆
                  </Typography>

                  <Typography mb={2}>
                    You&apos;ve made it to the finish line! The rewards program has officially ended, but the points
                    you&apos;ve earned are just the beginning. It’s time to get SAFE tokens your way.
                  </Typography>

                  <Box ref={particlesRef}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        backgroundColor: 'static.main',
                        color: 'text.primary',
                        '&:hover': { backgroundColor: 'static.main' },
                      }}
                    >
                      Start claiming
                    </Button>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} lg={5}>
                <Stack spacing={3} justifyContent="center" height="100%">
                  <Stack gap={2} alignItems="center">
                    <Typography variant="overline" fontWeight="700">
                      Reward tokens
                    </Typography>
                    <Stack direction="row" gap={3}>
                      <SvgIcon
                        component={Spotlight}
                        inheritViewBox
                        fontSize="inherit"
                        sx={{ color: 'transparent', fontSize: '4rem' }}
                      />
                      <SafeToken />
                      <SvgIcon
                        component={Spotlight}
                        inheritViewBox
                        fontSize="inherit"
                        sx={{ color: 'transparent', fontSize: '4rem', transform: 'scaleX(-1)' }}
                      />
                    </Stack>
                    <Stack direction="row" gap={1}>
                      <PointsCounter
                        value={Number(formatEther(totalSAP.allocation))}
                        variant="h2"
                        fontWeight={700}
                        fontSize="44px"
                      />
                      <Typography fontWeight={700} fontSize="44px" lineHeight="1">
                        SAFE
                      </Typography>
                    </Stack>
                    <Typography>Available from 15.01.2026</Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </PaperContainer>
        </Grid>
      </Grid>

      {globalRank && (
        <Grid container pt={3} spacing={3}>
          <Grid item xs={12} lg={4}>
            <PaperContainer>
              <Stack alignItems="center">
                <PointsCounter value={campaigns.length} variant="h2" fontWeight={700} fontSize="44px" />
                <Typography color="text.secondary" mt={1}>
                  Campaigns completed
                </Typography>
              </Stack>
            </PaperContainer>
          </Grid>

          <Grid item xs={12} lg={4}>
            <PaperContainer>
              <Stack alignItems="center">
                <PointsCounter value={globalRank.position} variant="h2" fontWeight={700} fontSize="44px" />
                <Typography color="text.secondary" mt={1} display="flex" alignItems="center" gap={1}>
                  <SvgIcon component={Star} inheritViewBox color="border" /> Leaderboard score
                </Typography>
              </Stack>
            </PaperContainer>
          </Grid>

          <Grid item xs={12} lg={4}>
            <PaperContainer>
              <Stack alignItems="center">
                <PointsCounter value={globalRank.totalPoints} variant="h2" fontWeight={700} fontSize="44px" />
                <Typography color="text.secondary" mt={1} display="flex" alignItems="center" gap={1}>
                  <SvgIcon component={Star1} inheritViewBox color="border" /> Total points
                </Typography>
              </Stack>
            </PaperContainer>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3} pt={3}>
        <Grid item xs={12} lg={6}>
          <PaperContainer>
            <Stack p={4}>
              <Typography variant="h4" fontWeight={700} fontSize="24px" mb={2}>
                How to claim?
              </Typography>
              <Typography color="text.secondary">Description text.</Typography>
            </Stack>
          </PaperContainer>
        </Grid>
        <Grid item xs={12} lg={6}>
          <PaperContainer>
            <Stack p={4}>
              <Typography variant="h4" fontWeight={700} fontSize="24px" mb={2}>
                When can I get tokens?
              </Typography>
              <Typography color="text.secondary">Description text.</Typography>
            </Stack>
          </PaperContainer>
        </Grid>
      </Grid>
      <Grid item xs={12} mt={2}>
        <SafePassDisclaimer />
      </Grid>
    </>
  )
}

export default Points
