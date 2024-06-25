import Tabs from '@mui/material/Tabs'
import Tab, { TabProps } from '@mui/material/Tab'
import { Box, Button, Chip, Tooltip, Typography } from '@mui/material'
import css from './styles.module.css'
import { Campaign, useCampaignPage } from '@/hooks/useCampaigns'
import { ReactNode, useMemo, useState } from 'react'
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

  const statusChip = !hasStarted ? (
    <Chip variant="outlined" className={css.comingSoon} label="soon" />
  ) : hasEnded ? (
    <Chip variant="outlined" className={css.comingSoon} label="done" />
  ) : null

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
      {campaign.name} {statusChip}
    </Typography>
  )
}

const PAGE_SIZE = 5

const CampaignTabsPage = ({ index, onLoadMore, ...props }: TabProps & { index: number; onLoadMore?: () => void }) => {
  const campaigns = useCampaignPage(PAGE_SIZE, PAGE_SIZE * index)
  const globalCampaign = useGlobalCampaignId()

  const dynamicTabs = useMemo(
    () =>
      campaigns?.results
        ?.filter((campaign) => campaign.resourceId !== globalCampaign)
        .map((campaign) => ({
          label: <CampaignTab key={campaign.resourceId} campaign={campaign} />,
          value: campaign.resourceId,
        })) ?? [],
    [campaigns?.results, globalCampaign],
  )

  return (
    <>
      {dynamicTabs.map((tab, tabIdx) => (
        <Tab
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            textAlign: 'left',
            alignItems: 'start',
            marginLeft: 2.5,
            borderLeft: ({ palette }) => `1px solid ${palette.border.light}`,
            '&.Mui-selected': {
              backgroundColor: ({ palette }) => palette.background.light,
            },
          }}
          key={tab.value}
          {...props}
          {...tab}
        />
      ))}
      {onLoadMore && campaigns?.count && campaigns.count > PAGE_SIZE * (index + 1) && (
        <Button onClick={onLoadMore}>Load more</Button>
      )}
    </>
  )
}

const CampaignTabs = ({
  onChange,
  selectedCampaignId,
}: {
  onChange: (campaignId: string) => void
  selectedCampaignId: string
}) => {
  const [pages, setPages] = useState(1)
  const globalCampaign = useGlobalCampaignId()

  const globalTab: CampaignTabProps = {
    label: (
      <Typography display="flex" flexDirection="row" gap={1} alignItems="center" fontWeight={700}>
        <Tooltip title="This campaign is active" arrow>
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
  }

  return (
    <Box padding="8px 0px">
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={selectedCampaignId}
        aria-label="Vertical tabs example"
        sx={{ border: 1, borderColor: 'divider', borderRadius: '6px', pt: 2, pb: 2, minWidth: '286px' }}
        onChange={(_, value) => onChange(value)}
      >
        <Tab
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            textAlign: 'left',
            alignItems: 'start',
            '&.Mui-selected': {
              backgroundColor: ({ palette }) => palette.background.light,
            },
          }}
          {...globalTab}
        />

        {Array.from(new Array(pages)).map((_, index) => (
          <CampaignTabsPage
            index={index}
            key={index}
            onLoadMore={index === pages - 1 ? () => setPages((prev) => prev + 1) : undefined}
          />
        ))}
      </Tabs>
    </Box>
  )
}

export default CampaignTabs
