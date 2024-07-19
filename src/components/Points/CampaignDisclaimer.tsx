import { SAFE_TERMS_AND_CONDITIONS_URL } from '@/config/constants'
import { Stack, Button, Typography } from '@mui/material'
import { useState } from 'react'
import { ExternalLink } from '../ExternalLink'

export const CampaignDisclaimer = () => {
  const [open, setOpen] = useState(false)

  return (
    <Stack alignItems="center" gap={1}>
      {open && (
        <Typography color="text.secondary" fontSize="12px">
          By participating in a partner campaign and/or accessing third party applications provided by a partner of Safe
          {'{Pass}'} Program that we do not own, control, maintain or audit you acknowledge and agree that Safe
          Ecosystem Foundation and/ or Safe {'{Wallet}'} is not liable for any loss you may incur in connection with
          your interaction with the third party applications and/or programs and services, which is at your own risk.
          The third parties are solely responsible for ensuring that their applications, user incentive programs and/or
          services, even if integrated with the Safe {'{Wallet}'} / Safe{'{Pass}'} Program and/or related programs, are
          established and operated in compliance with all applicable laws and regulations in accordance with their
          respective terms and conditions. Please{' '}
          <ExternalLink href={SAFE_TERMS_AND_CONDITIONS_URL} sx={{ fontSize: '12px !important' }}>
            read our terms
          </ExternalLink>{' '}
          for further information.
        </Typography>
      )}
      <Button color="secondary" size="small" variant="text" onClick={() => setOpen((prev) => !prev)}>
        {open ? 'Hide disclaimer' : 'Read disclaimer'}
      </Button>
    </Stack>
  )
}
