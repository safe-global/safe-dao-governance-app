import { Skeleton, SvgIcon, Typography } from '@mui/material'
import PaperContainer from '../PaperContainer'

import css from './styles.module.css'

import NeonStart from '@/public/images/neon-star.svg'
import { ActivityList } from './ActivityList'
import { Campaign } from '@/hooks/useCampaigns'
import { formatDate } from '@/utils/date'

export const CampaignInfo = ({ campaign }: { campaign: Campaign | undefined }) => {
  const startDateFormatted = formatDate(new Date(campaign?.startDate ?? '0'))
  const endDateFormatted = formatDate(new Date(campaign?.endDate ?? '0'))

  if (!campaign) {
    return (
      <PaperContainer sx={{ position: 'relative', overflow: 'hidden' }}>
        <SvgIcon
          component={NeonStart}
          inheritViewBox
          sx={{
            color: 'transparent',
            position: 'absolute',
            top: '-16px',
            right: '-16px',
            height: '220px',
            width: '179px',
          }}
        />
        <Typography variant="overline" fontWeight={700} color="text.secondary">
          Current campaign
        </Typography>
        <Typography mt={4} variant="overline" fontWeight={700} maxWidth="80%" color="text.secondary">
          <Skeleton />
        </Typography>
        <Typography variant="overline" fontWeight={700} maxWidth="80%" color="text.secondary">
          <Skeleton />
        </Typography>
        <Typography variant="overline" fontWeight={700} maxWidth="80%" color="text.secondary">
          <Skeleton />
        </Typography>
      </PaperContainer>
    )
  }

  return (
    <PaperContainer sx={{ position: 'relative', overflow: 'hidden' }}>
      <SvgIcon
        component={NeonStart}
        inheritViewBox
        sx={{
          color: 'transparent',
          position: 'absolute',
          top: '-16px',
          right: '-16px',
          height: '220px',
          width: '179px',
        }}
      />
      <Typography variant="overline" fontWeight={700} color="text.secondary">
        Current campaign
      </Typography>
      <Typography variant="h1" fontWeight={700} maxWidth="80%" className={css.gradientText}>
        {campaign?.name}
      </Typography>
      <Typography mt={-2}>
        {startDateFormatted} - {endDateFormatted}
      </Typography>
      <Typography mt={-1} variant="body2" color="text.secondary">
        {campaign.description}
      </Typography>
      <ActivityList campaign={campaign} />
    </PaperContainer>
  )
}
