import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { Box, Chip, Tooltip, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import css from './styles.module.css'

const CAMPAIGN_TABS = [
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
  },
  {
    label: (
      <Typography display="flex" flexDirection="row" gap={1} alignItems="center" fontWeight={700}>
        <Box
          sx={{
            borderRadius: '100%',
            backgroundColor: ({ palette }) => palette.text.disabled,
            minWidth: '6px',
            minHeight: '6px',
            flexShrink: 0,
            marginRight: 1,
          }}
        />
        Campaigns <Chip variant="outlined" className={css.comingSoon} label="soon" />
      </Typography>
    ),
    disabled: true,
  },
] as const

const CampaignTabs = ({ onChange, selectedTabIdx }: { onChange: (tab: number) => void; selectedTabIdx: number }) => {
  const theme = useTheme()
  return (
    <Box padding="8px 0px">
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={selectedTabIdx}
        aria-label="Vertical tabs example"
        sx={{ border: 1, borderColor: 'divider', borderRadius: '6px' }}
        onChange={(_, value) => onChange(value)}
      >
        {CAMPAIGN_TABS.map((tab, tabIdx) => (
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
