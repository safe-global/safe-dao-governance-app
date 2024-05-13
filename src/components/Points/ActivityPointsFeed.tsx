import { GLOBAL_CAMPAIGN_IDS } from '@/config/constants'
import { Campaign } from '@/hooks/useCampaigns'
import { useChainId } from '@/hooks/useChainId'
import { useOwnCampaignRank } from '@/hooks/useLeaderboard'
import { formatDatetime } from '@/utils/date'
import { Divider, Skeleton, Stack, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useEffect, useMemo, useState } from 'react'
import PointsCounter from '../PointsCounter'

const HiddenValue = () => (
  <Typography minWidth="80px">
    <Skeleton />
  </Typography>
)

export const ActivityPointsFeed = ({ campaign }: { campaign?: Campaign }) => {
  const ownEntry = useOwnCampaignRank(campaign?.resourceId)

  const data = useMemo(() => {
    return {
      activityPoints: ownEntry?.points,
      boostedPoints: ownEntry?.boostedPoints,
      totalPoints: ownEntry?.boostedPoints,
    }
  }, [ownEntry?.boostedPoints, ownEntry?.points])

  const [showBoostPoints, setShowBoostPoints] = useState(false)
  const [showTotalPoints, setShowTotalPoints] = useState(false)

  useEffect(() => {
    if (ownEntry !== undefined) {
      const showBoostPointsTimeout = setTimeout(() => setShowBoostPoints(true), 1000)
      const showTotalPointsTimeout = setTimeout(() => setShowTotalPoints(true), 2000)

      return () => {
        clearTimeout(showBoostPointsTimeout)
        clearTimeout(showTotalPointsTimeout)
      }
    }
  }, [ownEntry])

  const chainId = useChainId()

  const globalCampaignId = GLOBAL_CAMPAIGN_IDS[chainId]

  const isGlobal = campaign?.resourceId === globalCampaignId

  if (!campaign) {
    return null
  }

  if (!ownEntry) {
    return (
      <Box
        key={campaign?.resourceId}
        sx={{
          border: ({ palette }) => `1px solid ${palette.border.light}`,
          borderRadius: '6px',
          p: '24px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography color="text.secondary">Activity points</Typography>
          <HiddenValue />
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography color="text.secondary">Boost points</Typography>
          <HiddenValue />
        </Stack>
        <Divider />
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography color="text.secondary">{!isGlobal && 'Campaign'} Total</Typography>
          <HiddenValue />
        </Stack>
        <HiddenValue />
      </Box>
    )
  }

  return (
    <Box
      key={campaign?.resourceId}
      sx={{
        border: ({ palette }) => `1px solid ${palette.border.light}`,
        borderRadius: '6px',
        p: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Typography color="text.secondary">Activity points</Typography>
        <PointsCounter value={Number(data.activityPoints)} fontWeight={700}>
          points
        </PointsCounter>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Typography color="text.secondary">Boost points</Typography>
        {showBoostPoints ? (
          <PointsCounter value={Number(data.boostedPoints)} fontWeight={700}>
            points
          </PointsCounter>
        ) : (
          <HiddenValue />
        )}
      </Stack>
      <Divider />
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Typography color="text.secondary">{!isGlobal && 'Campaign'} Total</Typography>
        {showTotalPoints ? (
          <PointsCounter value={Number(data.totalPoints)} fontWeight={700} fontSize="27px" color="primary">
            points
          </PointsCounter>
        ) : (
          <HiddenValue />
        )}
      </Stack>
      <Typography mt={6} alignSelf="center" color="text.secondary">
        Last updated {formatDatetime(new Date(campaign.lastUpdated))}
      </Typography>
    </Box>
  )
}
