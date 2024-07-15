import { Box, Button, LinearProgress, Stack, SvgIcon, Typography } from '@mui/material'
import PaperContainer from '../PaperContainer'
import MorhoIcon from '@/public/images/morpho.svg'
import SpotlightIcon from '@/public/images/spotlight.svg'

import css from './styles.module.css'
import { MORPHO_CAMPAIGN_IDS } from '@/config/constants'
import { useChainId } from '@/hooks/useChainId'
import { useCampaignInfo } from '@/hooks/useCampaigns'
import { getRelativeTime } from '@/utils/date'
import { getSafeAppUrl } from '@/utils/safe-apps'
import { useAddress } from '@/hooks/useAddress'
import { useMemo } from 'react'

export const CampaignPromo = () => {
  const chainId = useChainId()
  const address = useAddress()
  const morphoCampaignId = MORPHO_CAMPAIGN_IDS[chainId]

  const morphoCampaign = useCampaignInfo(morphoCampaignId)

  const safeAppUrl = useMemo(
    () => (address ? getSafeAppUrl(chainId, address, 'https://safe-app.morpho.org/') : ''),
    [chainId, address],
  )

  if (!morphoCampaign) {
    return null
  }

  const hasStarted = new Date(morphoCampaign.startDate).getTime() <= Date.now()
  const hasEnded = new Date(morphoCampaign.endDate).getTime() <= Date.now()

  const progress =
    Math.max(Date.now() - new Date(morphoCampaign.startDate).getTime(), 0) /
    (new Date(morphoCampaign.endDate).getTime() - new Date(morphoCampaign.startDate).getTime())

  if (hasEnded) {
    return null
  }

  return (
    <PaperContainer sx={{ overflow: 'hidden' }}>
      <LinearProgress
        className={css.progressBar}
        variant="determinate"
        value={progress}
        sx={{
          mt: '-40px',
          ml: '-32px',
          mr: '-32px',
        }}
      />
      <Stack alignItems="center">
        <Typography variant="body2" color="text.secondary" mb={2}>
          {morphoCampaign
            ? !hasStarted
              ? `Starts in ${getRelativeTime(new Date(morphoCampaign.startDate))}`
              : `Ends in ${getRelativeTime(new Date(morphoCampaign.endDate))}`
            : null}
        </Typography>
        <Box position="relative">
          <SvgIcon
            component={SpotlightIcon}
            inheritViewBox
            sx={{
              position: 'absolute',
              top: 0,
              left: '-21px',
              width: '42px',
              height: '56px',
            }}
          />
          <SvgIcon
            component={MorhoIcon}
            inheritViewBox
            sx={{
              width: '148px',
              height: '100px',
            }}
          />
          <SvgIcon
            component={SpotlightIcon}
            inheritViewBox
            sx={{
              position: 'absolute',
              top: 0,
              right: '-21px',
              width: '42px',
              height: '56px',
              transform: 'rotateY(180deg)',
            }}
          />
        </Box>

        <Typography mt={5} variant="overline" color="text.secondary">
          Prize pool
        </Typography>
        <Typography mt={1} variant="h4" fontSize="27px" fontWeight={700}>
          600,000 <span style={{ color: '#2470FF' }}>MORPHO</span>
        </Typography>
        <Typography variant="body2">& Safe points</Typography>
        <Typography variant="body2" color="text.secondary" mt={5}>
          Learn more and participate in campaign:
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2} mt={2}>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            href={safeAppUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Open Safe App
          </Button>
          <Typography>or</Typography>
          <Button
            href="https://app.morpho.org/"
            rel="noopener noreferrer"
            target="_blank"
            variant="outlined"
            size="small"
            sx={{
              color: '#2470FF',
              '&:hover': {
                backgroundColor: ({ palette }) => `rgba(36, 112, 255, ${palette.action.hoverOpacity})`,
              },
            }}
          >
            Go to Morpho
          </Button>
        </Stack>
      </Stack>
    </PaperContainer>
  )
}
