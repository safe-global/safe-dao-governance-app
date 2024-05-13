import { Campaign } from '@/hooks/useCampaigns'
import { InfoOutlined } from '@mui/icons-material'
import { Grid, Stack, Tooltip, Typography } from '@mui/material'

export const ActivityList = ({ campaign }: { campaign?: Campaign }) => {
  const { activitiesMetadata } = campaign ?? {}
  return (
    <Grid container direction="row" spacing={2}>
      {activitiesMetadata?.map((activity) => (
        <Grid key={activity.name} item xs={12}>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            sx={{
              border: ({ palette }) => `1px solid ${palette.border.light}`,
              padding: 2,
              borderRadius: '6px',
            }}
          >
            <Typography display="flex" flexDirection="row" gap={1} alignItems="center">
              {activity.name}
              <Tooltip title={activity.description}>
                <InfoOutlined fontSize="small" color="border" />
              </Tooltip>
            </Typography>

            <Typography>
              <b>up to {activity.maxPoints}</b> Points
            </Typography>
          </Stack>
        </Grid>
      ))}
    </Grid>
  )
}
