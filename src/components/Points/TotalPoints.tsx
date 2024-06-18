import { useGlobalCampaignId } from '@/hooks/useGlobalCampaignId'
import { useOwnCampaignRank } from '@/hooks/useLeaderboard'
import { InfoOutlined } from '@mui/icons-material'
import { Box, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import { useMemo } from 'react'
import PaperContainer from '../PaperContainer'
import PointsCounter from '../PointsCounter'

export const TotalPoints = () => {
  const globalCampaignId = useGlobalCampaignId()
  const ownRank = useOwnCampaignRank(globalCampaignId)

  const totalPoints = useMemo(
    () => (ownRank.isLoading ? undefined : ownRank.data?.totalBoostedPoints ?? 0),
    [ownRank.data?.totalBoostedPoints, ownRank.isLoading],
  )

  return (
    <PaperContainer>
      <Stack alignItems="center" gap={1.5} textAlign="center">
        {totalPoints !== undefined ? (
          <PointsCounter value={totalPoints} variant="h2" fontWeight={700} fontSize="44px" color="primary" />
        ) : (
          <Typography minWidth="30px">
            <Skeleton />
          </Typography>
        )}
        <Box display="flex" flexDirection="row" gap={1} alignItems="center">
          <Typography color="text.secondary">Your total points</Typography>
          <Tooltip title="All points collected form capaigns and regular Safe activities" arrow>
            <InfoOutlined fontSize="small" sx={{ color: ({ palette }) => palette.text.secondary }} />
          </Tooltip>
        </Box>
      </Stack>
    </PaperContainer>
  )
}
