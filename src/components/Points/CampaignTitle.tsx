import { Campaign } from '@/hooks/useCampaigns'
import { useGlobalCampaignId } from '@/hooks/useGlobalCampaignId'
import { formatDate } from '@/utils/date'
import { Box, Chip, Typography, Tooltip, TypographyProps, Stack } from '@mui/material'
import css from './styles.module.css'

export const CampaignTitle = ({
  campaign,
  showDates = false,
  suppressStatusDot = false,
  ...props
}: TypographyProps & { campaign: Campaign; showDates?: boolean; suppressStatusDot?: boolean }) => {
  const hasStarted = new Date(campaign.startDate).getTime() < Date.now()
  const hasEnded = new Date(campaign.endDate).getTime() < Date.now()
  const startDateFormatted = formatDate(new Date(campaign?.startDate ?? '0'), true)
  const endDateFormatted = formatDate(new Date(campaign?.endDate ?? '0'), true)

  const globalCampaignId = useGlobalCampaignId()
  const isGlobal = campaign.resourceId === globalCampaignId
  const isActive = isGlobal || (hasStarted && !hasEnded)

  const statusChip = !hasStarted ? (
    <Chip variant="outlined" className={css.chipSoon} label="Soon" />
  ) : hasEnded ? (
    <Chip variant="outlined" className={css.chipFinished} label="Finished" />
  ) : (
    <Chip variant="outlined" className={css.chipActive} label="Active" />
  )

  return (
    <Typography display="flex" flexDirection="row" width="100%" gap={1} alignItems="center" fontWeight={700} {...props}>
      {!suppressStatusDot && (
        <Tooltip title={`This campaign is ${isActive ? 'active' : 'inactive'}`} arrow>
          <Box
            sx={{
              borderRadius: '100%',
              backgroundColor: ({ palette }) => (isActive ? palette.primary.main : palette.text.disabled),
              minWidth: '6px',
              minHeight: '6px',
              flexShrink: 0,
              marginRight: 1,
            }}
          />
        </Tooltip>
      )}
      <Stack>
        {!isGlobal && showDates && (
          <Typography variant="overline" fontWeight={700} color="text.secondary">
            {startDateFormatted} - {endDateFormatted}
          </Typography>
        )}
        {isGlobal ? 'Global' : campaign.name}
      </Stack>
      {isGlobal ? <Chip variant="outlined" className={css.chipActive} label="active" /> : statusChip}
    </Typography>
  )
}
