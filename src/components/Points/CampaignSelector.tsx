import { Campaign } from '@/hooks/useCampaigns'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

export const CampaignSelector = ({
  campaigns,
  selectedCampaignId,
  setSelectedCampaignId,
}: {
  campaigns: Campaign[]
  selectedCampaignId: string
  setSelectedCampaignId: (id: string) => void
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="campaign-select-label">Campaign</InputLabel>
      <Select
        labelId="campaign-select-label"
        id="campaign-select"
        value={selectedCampaignId}
        label="Campaign"
        onChange={(e) => setSelectedCampaignId(e.target.value)}
      >
        {campaigns.map((campaign) => (
          <MenuItem key={campaign.resourceId} value={campaign.resourceId}>
            {campaign.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
