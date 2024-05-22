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
            alignItems="center"
            spacing={1}
            sx={{
              border: ({ palette }) => `1px solid ${palette.border.light}`,
              padding: 2,
              borderRadius: '6px',
            }}
          >
            <Typography>{activity.name}</Typography>
            <Tooltip title={activity.description}>
              <InfoOutlined fontSize="small" color="border" />
            </Tooltip>
          </Stack>
        </Grid>
      ))}
    </Grid>
  )
}
