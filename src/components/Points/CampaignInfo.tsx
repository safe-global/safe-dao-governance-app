import { Skeleton, SvgIcon, Typography } from '@mui/material'
import PaperContainer from '../PaperContainer'

import css from './styles.module.css'

import NeonStart from '@/public/images/neon-star.svg'
import { ActivityList } from './ActivityList'
import { Campaign } from '@/hooks/useCampaigns'
import { formatDate } from '@/utils/date'
import { useGlobalCampaignId } from '@/hooks/useGlobalCampaignId'

export const CampaignInfo = ({ campaign }: { campaign: Campaign | undefined }) => {
  const startDateFormatted = formatDate(new Date(campaign?.startDate ?? '0'), true)
  const endDateFormatted = formatDate(new Date(campaign?.endDate ?? '0'), true)

  const globalCampaignId = useGlobalCampaignId()
  const isGlobal = campaign?.resourceId === globalCampaignId

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
          <Skeleton />
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
        {!isGlobal ? (
          <>
            {startDateFormatted} - {endDateFormatted}
          </>
        ) : (
          'unlimited campaign'
        )}
      </Typography>
      <Typography variant="h1" fontWeight={700} maxWidth="80%" className={css.gradientText}>
        {campaign?.name}
      </Typography>
      <Typography mt={-1} variant="body2" color="text.secondary">
        {campaign.description}
      </Typography>
      <ActivityList campaign={campaign} />
    </PaperContainer>
  )
}
