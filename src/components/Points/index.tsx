import { Grid, Typography, Stack, Box, Divider, Button } from '@mui/material'
import { ExternalLink } from '../ExternalLink'
import PaperContainer from '../PaperContainer'
import SafePassDisclaimer from '../SafePassDisclaimer'
import css from './styles.module.css'
import { useGlobalCampaignId } from '@/hooks/useGlobalCampaignId'
import { useOwnCampaignRank } from '@/hooks/useLeaderboard'
import PointsCounter from '@/components/PointsCounter'
import SafeToken from '@/public/images/token.svg'

const Points = () => {
  const globalCampaignId = useGlobalCampaignId()
  const { data: globalRank } = useOwnCampaignRank(globalCampaignId)

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
          alignItems="center"
        >
          <Typography variant="h1">{'Get your Safe{Pass} rewards'}</Typography>
          <Box ml="auto">
            <ExternalLink href="https://safe.global/pass">{'What is Safe{Pass}'}</ExternalLink>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <PaperContainer>
            <Stack gap={2} alignItems="flex-start" p={4}>
              <Typography variant="h3" fontWeight={700} fontSize="32px">
                Rewards Await! 🏆
              </Typography>

              <Typography color="text.secondary" mb={2}>
                You&apos;ve made it to the finish line! The rewards program has officially ended, but the points
                you&apos;ve earned are just the beginning. It’s time to get SAFE tokens your way.
              </Typography>

              <Button variant="contained">Start claiming</Button>
            </Stack>
          </PaperContainer>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Stack spacing={3} justifyContent="stretch" height="100%">
            <PaperContainer
              sx={{
                height: 1,
                justifyContent: 'center',
                background: 'linear-gradient(180deg, #B0FFC9 0%, #D7F6FF 99.5%)',
                color: 'static.main',
              }}
            >
              <Stack gap={2} alignItems="center">
                <Typography variant="overline">Reward tokens</Typography>
                <SafeToken />
                <Stack direction="row" gap={1}>
                  <PointsCounter value={2365} variant="h2" fontWeight={700} fontSize="44px" />
                  <Typography fontWeight={700} fontSize="44px" lineHeight="1">
                    SAFE
                  </Typography>
                </Stack>
                <Typography>Available from 15.01.2026</Typography>
              </Stack>
            </PaperContainer>
          </Stack>
        </Grid>
      </Grid>

      <Grid container pt={3}>
        <Grid item xs={12} lg={7}>
          <PaperContainer sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
            <Stack p={4}>
              <Typography variant="h3" fontWeight={700} fontSize="32px" mb={2}>
                Your score calculation
              </Typography>
              <Typography>Your total rewarded tokens were calculated based on your total points.</Typography>
            </Stack>
          </PaperContainer>
        </Grid>
        <Grid item xs={12} lg={5}>
          <PaperContainer
            sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, height: '100%', justifyContent: 'center' }}
          >
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} minHeight="60px">
              {globalRank && (
                <>
                  <Stack alignItems="center">
                    <PointsCounter value={globalRank.position} variant="h2" fontWeight={700} fontSize="44px" />
                    <Typography color="text.secondary" mt={1}>
                      Leaderboard score
                    </Typography>
                  </Stack>

                  <Divider orientation="vertical" sx={{ height: '80px', margin: '0 24px 0 40px' }} />

                  <Stack alignItems="center">
                    <PointsCounter value={globalRank.totalPoints} variant="h2" fontWeight={700} fontSize="44px" />
                    <Typography color="text.secondary" mt={1}>
                      Total points
                    </Typography>
                  </Stack>
                </>
              )}
            </Stack>
          </PaperContainer>
        </Grid>
      </Grid>

      <Grid container spacing={3} pt={3}>
        <Grid item xs={12} lg={6}>
          <PaperContainer>
            <Stack p={4}>
              <Typography variant="h4" fontWeight={700} fontSize="24px" mb={2}>
                How to claim?
              </Typography>
              <Typography>Description text.</Typography>
            </Stack>
          </PaperContainer>
        </Grid>
        <Grid item xs={12} lg={6}>
          <PaperContainer>
            <Stack p={4}>
              <Typography variant="h4" fontWeight={700} fontSize="24px" mb={2}>
                When can I get tokens?
              </Typography>
              <Typography>Description text.</Typography>
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
