import { Campaign } from '@/hooks/useCampaigns'
import { useGlobalCampaignId } from '@/hooks/useGlobalCampaignId'
import { Box, Chip, Typography, Tooltip, TypographyProps } from '@mui/material'
import css from './styles.module.css'

export const CampaignTitle = ({ campaign, ...props }: TypographyProps & { campaign: Campaign }) => {
  const hasStarted = new Date(campaign.startDate).getTime() < Date.now()
  const hasEnded = new Date(campaign.endDate).getTime() < Date.now()

  const globalCampaignId = useGlobalCampaignId()
  const isGlobal = campaign.resourceId === globalCampaignId
  const isActive = isGlobal || (hasStarted && !hasEnded)

  const statusChip = !hasStarted ? (
    <Chip variant="outlined" className={css.chipSoon} label="soon" />
  ) : hasEnded ? (
    <Chip variant="outlined" className={css.chipFinished} label="finished" />
  ) : (
    <Chip variant="outlined" className={css.chipActive} label="active" />
  )

  return (
    <Typography display="flex" flexDirection="row" width="100%" gap={1} alignItems="center" fontWeight={700} {...props}>
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
      {isGlobal ? 'Global' : campaign.name}
      {isGlobal ? <Chip variant="outlined" className={css.chipActive} label="active" /> : statusChip}
    </Typography>
  )
}
