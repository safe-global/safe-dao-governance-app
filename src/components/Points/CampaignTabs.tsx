import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { Box, Chip, Tooltip, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import css from './styles.module.css'
import { Campaign, useCampaignPage } from '@/hooks/useCampaigns'
import { ReactNode, useMemo } from 'react'
import { useGlobalCampaignId } from '@/hooks/useGlobalCampaignId'

type CampaignTabProps = {
  label: ReactNode
  disabled: boolean
  value: string
}

const CampaignTab = ({ campaign }: { campaign: Campaign }) => {
  const hasStarted = new Date(campaign.startDate).getTime() < Date.now()
  const hasEnded = new Date(campaign.endDate).getTime() < Date.now()
  const isActive = hasStarted && !hasEnded
  return (
    <Typography display="flex" flexDirection="row" gap={1} alignItems="center" fontWeight={700}>
      <Tooltip title={`This campaign is ${isActive ? 'active' : 'inactive'}`} arrow>
        <Box
          sx={{
            borderRadius: '100%',
            backgroundColor: ({ palette }) => (hasStarted && !hasEnded ? palette.primary.main : palette.text.disabled),
            minWidth: '6px',
            minHeight: '6px',
            flexShrink: 0,
            marginRight: 1,
          }}
        />
      </Tooltip>
      {campaign.name} {!hasStarted && <Chip variant="outlined" className={css.comingSoon} label="soon" />}
    </Typography>
  )
}

const CampaignTabs = ({
  onChange,
  selectedCampaignId,
}: {
  onChange: (campaignId: string) => void
  selectedCampaignId: string
}) => {
  const campaigns = useCampaignPage(5)
  const globalCampaign = useGlobalCampaignId()

  const dynamicTabs = useMemo(
    () =>
      campaigns?.results
        ?.filter((campaign) => campaign.resourceId !== globalCampaign)
        .map((campaign) => ({
          label: <CampaignTab key={campaign.resourceId} campaign={campaign} />,
          disabled: false,
          value: campaign.resourceId,
        })) ?? [],
    [campaigns?.results, globalCampaign],
  )

  const campaignTabs: CampaignTabProps[] = [
    {
      label: (
        <Typography display="flex" flexDirection="row" gap={1} alignItems="center" fontWeight={700}>
          <Tooltip title="This campaign is active now" arrow>
            <Box
              sx={{
                borderRadius: '100%',
                backgroundColor: ({ palette }) => palette.primary.main,
                minWidth: '6px',
                minHeight: '6px',
                flexShrink: 0,
                marginRight: 1,
              }}
            />
          </Tooltip>
          Global
        </Typography>
      ),
      disabled: false,
      value: globalCampaign,
    },
    ...dynamicTabs,
  ]

  const theme = useTheme()
  return (
    <Box padding="8px 0px">
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={selectedCampaignId}
        aria-label="Vertical tabs example"
        sx={{ border: 1, borderColor: 'divider', borderRadius: '6px' }}
        onChange={(_, value) => onChange(value)}
      >
        {campaignTabs.map((tab, tabIdx) => (
          <Tab
            sx={{ textTransform: 'none', fontWeight: 700, textAlign: 'left', alignItems: 'start' }}
            key={tabIdx}
            {...tab}
          />
        ))}
      </Tabs>
    </Box>
  )
}

export default CampaignTabs
