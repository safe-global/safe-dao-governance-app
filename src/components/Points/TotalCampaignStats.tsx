import { InfoOutlined } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import BoostCounter from '../BoostCounter'
import PointsCounter from '../PointsCounter'

export const TotalCampaignStats = ({ boost, points }: { boost: number; points: number }) => {
  return (
    <Stack direction="row" spacing={6} justifyContent="start">
      <Stack direction="column" alignItems="start" mt="auto" spacing={2}>
        <Typography
          variant="body2"
          color="text.secondary"
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={1}
        >
          Total points <InfoOutlined fontSize="small" />
        </Typography>
        <PointsCounter value={points} variant="h2" fontWeight={700} />
      </Stack>
      <Stack direction="column" alignItems="start" mt="auto" spacing={2}>
        <Typography
          variant="body2"
          color="text.secondary"
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={1}
        >
          Current Boost <InfoOutlined fontSize="small" />
        </Typography>
        <BoostCounter value={boost} variant="h2" fontWeight={700} color="primary" />
      </Stack>
    </Stack>
  )
}
