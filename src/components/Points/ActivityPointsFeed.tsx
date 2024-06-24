import { GLOBAL_CAMPAIGN_IDS } from '@/config/constants'
import { Campaign } from '@/hooks/useCampaigns'
import { useChainId } from '@/hooks/useChainId'
import { useOwnCampaignRank } from '@/hooks/useLeaderboard'
import { formatDate } from '@/utils/date'
import { Divider, Skeleton, Stack, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import PointsCounter from '../PointsCounter'
import Barcode from '@/public/images/horizontal_barcode.svg'
import css from './styles.module.css'
import { useLatestCampaignUpdate } from '@/hooks/useLatestCampaignUpdate'

const BorderedBox = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        border: ({ palette }) => `1px solid ${palette.border.light}`,
        borderRadius: '6px',
        p: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        position: 'relative',
      }}
    >
      {children}
    </Box>
  )
}

const HiddenValue = () => (
  <Typography minWidth="80px">
    <Skeleton />
  </Typography>
)

const DataWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Stack
      direction={{ xs: 'column', lg: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'start', lg: 'center' }}
      spacing={2}
    >
      {children}
    </Stack>
  )
}

export const ActivityPointsFeed = ({ campaign }: { campaign?: Campaign }) => {
  const { data: ownEntry, isLoading } = useOwnCampaignRank(campaign?.resourceId)
  const { data: latestUpdate, isLoading: isLatestUpdateLoading } = useLatestCampaignUpdate(campaign?.resourceId)

  const data = useMemo(() => {
    return {
      activityPoints: latestUpdate?.totalPoints ?? 0,
      boostedPoints: latestUpdate ? latestUpdate.totalBoostedPoints - latestUpdate.totalPoints : 0,
      totalPoints: latestUpdate?.totalBoostedPoints ?? 0,
      overallPoints: ownEntry?.totalBoostedPoints ?? 0,
    }
  }, [latestUpdate, ownEntry])

  const [showBoostPoints, setShowBoostPoints] = useState(false)
  const [showTotalPoints, setShowTotalPoints] = useState(false)
  const [showOverallPoints, setShowOverallPoints] = useState(false)

  useEffect(() => {
    if (isLoading || isLatestUpdateLoading) {
      return
    }
    const showBoostPointsTimeout = setTimeout(() => setShowBoostPoints(true), 1000)
    const showTotalPointsTimeout = setTimeout(() => setShowTotalPoints(true), 2000)
    const showOverallPointsTimeout = setTimeout(() => setShowOverallPoints(true), 3000)

    return () => {
      clearTimeout(showBoostPointsTimeout)
      clearTimeout(showTotalPointsTimeout)
      clearTimeout(showOverallPointsTimeout)
    }
  }, [ownEntry, isLoading, isLatestUpdateLoading])

  const chainId = useChainId()

  const globalCampaignId = GLOBAL_CAMPAIGN_IDS[chainId]

  const isGlobal = campaign?.resourceId === globalCampaignId

  if (!campaign) {
    return null
  }

  if (isLoading) {
    return (
      <>
        <BorderedBox key={campaign?.resourceId}>
          <DataWrapper>
            <Typography color="text.secondary">Last drop</Typography>
            <HiddenValue />
          </DataWrapper>
          <Divider
            sx={{
              marginRight: '-32px',
              marginLeft: '-32px',
            }}
          />
          <DataWrapper>
            <Typography color="text.secondary">Activity points</Typography>
            <HiddenValue />
          </DataWrapper>
          <DataWrapper>
            <Typography color="text.secondary">Boost points</Typography>
            <HiddenValue />
          </DataWrapper>
          <Divider />
          <DataWrapper>
            <Typography color="text.secondary">{!isGlobal && 'Campaign'} Week total</Typography>
            <HiddenValue />
          </DataWrapper>
          <Divider />
          <DataWrapper>
            <Typography color="text.secondary">{!isGlobal && 'Campaign'} Overall</Typography>
            <HiddenValue />
          </DataWrapper>
          <Typography mt={6} alignSelf="center" color="text.secondary">
            Your points are updated weekly.
          </Typography>
          <Barcode className={css.barcode} />
        </BorderedBox>
        {!isGlobal && (
          <BorderedBox>
            <DataWrapper>
              <Typography color="text.secondary">Campaign total</Typography>
              <HiddenValue />
            </DataWrapper>
          </BorderedBox>
        )}
      </>
    )
  }

  return (
    <>
      <BorderedBox key={campaign?.resourceId}>
        <DataWrapper>
          <Typography color="text.secondary">Your last drop</Typography>
          {latestUpdate && (
            <Typography color="text.secondary">
              {formatDate(new Date(latestUpdate.startDate))} - {formatDate(new Date(latestUpdate.endDate))}
            </Typography>
          )}
        </DataWrapper>
        <Divider
          sx={{
            marginRight: '-32px',
            marginLeft: '-32px',
          }}
        />
        <DataWrapper>
          <Typography color="text.secondary">Activity points</Typography>
          <PointsCounter value={Number(data.activityPoints)} fontWeight={700}>
            points
          </PointsCounter>
        </DataWrapper>
        <DataWrapper>
          <Typography color="text.secondary">Boost points</Typography>
          {showBoostPoints ? (
            <PointsCounter value={Number(data.boostedPoints)} fontWeight={700}>
              points
            </PointsCounter>
          ) : (
            <HiddenValue />
          )}
        </DataWrapper>
        <Divider />
        <DataWrapper>
          <Typography>{!isGlobal && 'Campaign'} Week total</Typography>
          {showTotalPoints ? (
            <PointsCounter value={Number(data.totalPoints)} fontWeight={700}>
              points
            </PointsCounter>
          ) : (
            <HiddenValue />
          )}
        </DataWrapper>
        <Typography mt={6} alignSelf="center" color="text.secondary">
          Your points are updated weekly.
        </Typography>
        <Typography mt={-2} alignSelf="center" color="text.secondary">
          Last update: {formatDate(new Date(campaign.lastUpdated))}
        </Typography>
        <Barcode className={css.barcode} />
      </BorderedBox>

      {!isGlobal && (
        <BorderedBox>
          <DataWrapper>
            <Typography color="text.secondary">Campaign total</Typography>
            {showOverallPoints ? (
              <PointsCounter value={Number(data.overallPoints)} fontWeight={700}>
                points
              </PointsCounter>
            ) : (
              <HiddenValue />
            )}
          </DataWrapper>
        </BorderedBox>
      )}
    </>
  )
}
