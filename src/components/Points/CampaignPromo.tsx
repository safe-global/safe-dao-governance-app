import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import PaperContainer from '../PaperContainer'

import css from './styles.module.css'
import { useChainId } from '@/hooks/useChainId'
import { useCampaignsPaginated } from '@/hooks/useCampaigns'
import { getRelativeTime } from '@/utils/date'
import { getSafeAppUrl } from '@/utils/safe-apps'
import { useAddress } from '@/hooks/useAddress'
import { useMemo } from 'react'
import { ExternalLink } from '../ExternalLink'
import { formatAmount } from '@/utils/formatters'

export const CampaignPromo = () => {
  const chainId = useChainId()
  const address = useAddress()
  const { data: campaignsPage } = useCampaignsPaginated()

  // We only check the first page as it contains the most up-to-date campaigns
  const promotedCampaign = useMemo(
    () => campaignsPage?.find((campaign) => campaign.isPromoted && new Date(campaign.endDate).getTime() > Date.now()),
    [campaignsPage],
  )

  const safeAppUrl = useMemo(
    () =>
      address && promotedCampaign?.safeAppUrl
        ? getSafeAppUrl(chainId, address, promotedCampaign?.safeAppUrl ?? '')
        : undefined,
    [address, chainId, promotedCampaign?.safeAppUrl],
  )

  if (!promotedCampaign) {
    return null
  }

  const hasStarted = new Date(promotedCampaign.startDate).getTime() <= Date.now()
  const hasEnded = new Date(promotedCampaign.endDate).getTime() <= Date.now()

  const progress =
    Math.max(Date.now() - new Date(promotedCampaign.startDate).getTime(), 0) /
    (new Date(promotedCampaign.endDate).getTime() - new Date(promotedCampaign.startDate).getTime())

  if (hasEnded) {
    return null
  }

  return (
    <PaperContainer sx={{ overflow: 'hidden' }}>
      <LinearProgress
        className={css.progressBar}
        variant="determinate"
        value={progress * 100}
        sx={{
          mt: '-40px',
          ml: '-32px',
          mr: '-32px',
        }}
      />
      <Stack alignItems="center">
        <Typography variant="body2" color="text.secondary" mb={2}>
          {promotedCampaign
            ? !hasStarted
              ? `Starts ${getRelativeTime(new Date(promotedCampaign.startDate))}`
              : `Ends ${getRelativeTime(new Date(promotedCampaign.endDate))}`
            : null}
        </Typography>
        {promotedCampaign.iconUrl ? (
          <Box position="relative">
            {promotedCampaign.iconUrl && (
              <img
                alt={'Campaign icon'}
                src={promotedCampaign.iconUrl}
                style={{ maxWidth: '176px', maxHeight: '80px', borderRadius: '8px' }}
              />
            )}
          </Box>
        ) : (
          <Typography variant="h1" fontWeight={700} maxWidth="80%" className={css.gradientText} mb={2}>
            {promotedCampaign.name}
          </Typography>
        )}
        <Box className={css.prizePoolBox}>
          <Typography variant="overline" color="text.secondary" fontWeight={700}>
            Prize pool
          </Typography>
          {promotedCampaign.rewardValue ? (
            <Typography mt={1} variant="h4" fontSize="27px" fontWeight={700}>
              {formatAmount(Number(promotedCampaign.rewardValue), 0)}{' '}
              <span style={{ color: '#817EE9' }}>{promotedCampaign.rewardText}</span>
            </Typography>
          ) : (
            <Typography mt={1} variant="h4" fontSize="27px" fontWeight={700}>
              {promotedCampaign.rewardText}
            </Typography>
          )}

          <Typography variant="body2">& Safe points</Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" mt={5}>
          Participate in campaign:
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2} mt={2}>
          {safeAppUrl && (
            <>
              <ExternalLink variant="button" color="primary" href={safeAppUrl} target="_blank" isPartner>
                Safe App
              </ExternalLink>
              <Typography>or</Typography>
            </>
          )}

          {promotedCampaign.partnerUrl && (
            <ExternalLink
              isPartner
              href={promotedCampaign.partnerUrl}
              target="_blank"
              variant="button"
              sx={{
                color: '#FFF',
                '&:hover': {
                  backgroundColor: ({ palette }) => `rgba(255, 255, 255, ${palette.action.hoverOpacity})`,
                },
              }}
            >
              {promotedCampaign.name}
            </ExternalLink>
          )}
        </Stack>
      </Stack>
    </PaperContainer>
  )
}
