import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { Box, Chip, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const CAMPAIGN_TABS = [
  {
    label: 'Global',
    disabled: false,
  },
  {
    label: (
      <Typography display="flex" flexDirection="row" gap={1} alignItems="center">
        Campaigns <Chip variant="outlined" sx={{ borderRadius: '4px' }} label="soon" />
      </Typography>
    ),
    disabled: true,
  },
] as const

const CampaignTabs = ({ onChange, selectedTabIdx }: { onChange: (tab: number) => void; selectedTabIdx: number }) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'))
  return (
    <Box padding="8px 0px">
      <Tabs
        orientation={isSmallScreen ? 'horizontal' : 'vertical'}
        variant="scrollable"
        value={selectedTabIdx}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
        onChange={(_, value) => onChange(value)}
      >
        {CAMPAIGN_TABS.map((tab, tabIdx) => (
          <Tab key={tabIdx} {...tab} />
        ))}
      </Tabs>
    </Box>
  )
}

export default CampaignTabs
