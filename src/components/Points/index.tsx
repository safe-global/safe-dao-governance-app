import { Grid, Typography, Stack, Box, Button, SvgIcon, Alert } from '@mui/material'
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
import { createSAPClaimTxs } from '@/utils/claim'
import { useSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { FingerprintJSPro } from '@fingerprintjs/fingerprintjs-pro-react'
import { useEffect, useState } from 'react'
import { FINGERPRINT_KEY, SAP_LOCK_DATE } from '@/config/constants'
import useUnsealedResult, { SealedRequest } from '@/hooks/useUnsealedResult'
import ClaimButton from '@/components/Points/ClaimButton'
import { useAggregateCampaignId } from '@/hooks/useAggregateCampaignId'
import { getVestingTypes } from '@/utils/vesting'

const Points = () => {
  const [sealedResult, setSealedResult] = useState<SealedRequest>()
  const { data: eligibility, isLoading } = useUnsealedResult(sealedResult)
  const { sdk, safe } = useSafeAppsSDK()
  const globalCampaignId = useGlobalCampaignId()
  const aggregateCampaignId = useAggregateCampaignId()
  const { data: globalRank } = useOwnCampaignRank(globalCampaignId)
  const { data: aggregateRank } = useOwnCampaignRank(aggregateCampaignId)
  const { data: allocation } = useSafeTokenAllocation()
  const { sapBoosted, sapUnboosted, totalSAP } = useTaggedAllocations(eligibility?.isAllowed)
  const { sapUnboostedVesting } = getVestingTypes(allocation?.vestingData || [])

  useEffect(() => {
    const fpPromise = FingerprintJSPro.load({
      apiKey: FINGERPRINT_KEY,
      region: 'eu',
    })

    fpPromise
      .then((fp) => fp.get({ extendedResult: true }))
      .then((fingerprint) => {
        setSealedResult({ requestId: fingerprint.requestId, sealedResult: fingerprint.sealedResult })
      })
      .catch((err) => console.error('Failed to fetch sealed client results: ', err))
  }, [])

  const startClaiming = async () => {
    // Something went wrong with fetching the eligibility for this user so we don't let them redeem
    if (!eligibility) return

    const txs = createSAPClaimTxs({
      vestingData: allocation?.vestingData ?? [],
      sapBoostedClaimable: eligibility.isAllowed ? sapBoosted.inVesting : '0',
      sapUnboostedClaimable: sapUnboosted.inVesting,
      safeAddress: safe.safeAddress,
    })

    try {
      await sdk.txs.send({ txs })
    } catch (error) {
      console.error(error)
    }
  }

  const loading = !sealedResult || isLoading
  const isSAPRedeemed = sapUnboostedVesting?.isRedeemed

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
                    You&apos;ve made it to the finish line! The rewards program has officially ended, and the points
                    earned, will be converted into rewards (including SAFE tokens)
                  </Typography>

                  {eligibility?.isVpn ? (
                    <Alert severity="info" variant="standard">
                      We detected that you are using a VPN. Please turn it off in order to start the claiming process.
                      <Box>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{
                            mt: 1,
                            backgroundColor: 'static.main',
                            color: 'text.primary',
                            '&:hover': { backgroundColor: 'static.main' },
                          }}
                          onClick={() => window.location.reload()}
                        >
                          Try again
                        </Button>
                      </Box>
                    </Alert>
                  ) : isSAPRedeemed ? (
                    <Alert severity="success" variant="standard">
                      Redeem successful! You will be able to claim your tokens starting from {SAP_LOCK_DATE}.
                    </Alert>
                  ) : !loading ? (
                    <ClaimButton startClaiming={startClaiming} />
                  ) : null}
                </Stack>
              </Grid>

              <Grid item xs={12} lg={5}>
                {!eligibility?.isVpn && !loading && (
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
                      <Typography>Available from {SAP_LOCK_DATE}</Typography>
                    </Stack>
                  </Stack>
                )}
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
                {aggregateRank && (
                  <>
                    <PointsCounter value={aggregateRank.totalPoints} variant="h2" fontWeight={700} fontSize="44px" />
                    <Typography color="text.secondary" mt={1}>
                      {`Campaign${aggregateRank.totalPoints > 1 ? 's' : ''} completed`}
                    </Typography>
                  </>
                )}
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
            <Stack p={4} position="relative">
              <Typography variant="h4" fontWeight={700} fontSize="24px" mb={2}>
                How are the SAFE token rewards distributed?
              </Typography>
              <Typography color="text.secondary">
                Rewards are distributed based on leaderboard standing, SAFE token locking, and participation in partner
                campaigns. A tiered system determines the distribution amount.
              </Typography>
              <Box position="absolute" right={3} bottom={3}>
                <ExternalLink href="https://safe.global/blog/safe-pass-wrap-up-over-2-5m-in-rewards-and-a-devcon-celebration">
                  Learn more
                </ExternalLink>
              </Box>
            </Stack>
          </PaperContainer>
        </Grid>
        <Grid item xs={12} lg={6}>
          <PaperContainer>
            <Stack p={4} position="relative">
              <Typography variant="h4" fontWeight={700} fontSize="24px" mb={2}>
                When can I get tokens?
              </Typography>
              <Typography color="text.secondary">
                Tokens are locked until {SAP_LOCK_DATE} and can be claimed after this date. Make sure to redeem the
                tokens before this date. Otherwise they cannot be claimed anymore.
              </Typography>
              <Box position="absolute" right={3} bottom={3}>
                <ExternalLink href="https://safe.global/blog/safe-pass-wrap-up-over-2-5m-in-rewards-and-a-devcon-celebration">
                  Learn more
                </ExternalLink>
              </Box>
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
