import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { Box, Button, Tooltip, Typography } from '@mui/material'
import { useCampaignsPaginated } from '@/hooks/useCampaigns'
import { ReactNode, useMemo, useState } from 'react'
import { useGlobalCampaignId } from '@/hooks/useGlobalCampaignId'
import { CampaignTitle } from './CampaignTitle'

type CampaignTabProps = {
  label: ReactNode
  disabled: boolean
  value: string
}

const CampaignTabs = ({
  onChange,
  selectedCampaignId,
}: {
  onChange: (campaignId: string) => void
  selectedCampaignId: string
}) => {
  const { data: campaigns, loadMore, hasMore } = useCampaignsPaginated()

  const globalCampaign = useGlobalCampaignId()

  const dynamicTabs = useMemo(
    () =>
      campaigns
        ?.filter((campaign) => campaign.resourceId !== globalCampaign)
        .map((campaign) => ({
          label: <CampaignTitle key={campaign.resourceId} campaign={campaign} />,
          value: campaign.resourceId,
        })) ?? [],
    [campaigns, globalCampaign],
  )

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

        {dynamicTabs.map((tab) => (
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
            {...tab}
            value={tab.value}
          />
        ))}
        {hasMore && <Button onClick={loadMore}>Load more</Button>}
      </Tabs>
    </Box>
  )
}

export default CampaignTabs
