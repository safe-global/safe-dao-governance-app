import type { ReactElement } from 'react'
import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material'
import css from './styles.module.css'
import { InfoOutlined } from '@mui/icons-material'
import { SAFE_TERMS_AND_CONDITIONS_URL } from '@/config/constants'
import { ExternalLink } from '../ExternalLink'

export const DisclaimerLink = ({
  title,
  buttonText,
  href,
  onCancel,
  onAccept,
}: {
  title: string
  buttonText?: string
  href: string
  onCancel: () => void
  onAccept: () => void
}): ReactElement => {
  return (
    <div className={css.container}>
      <Paper sx={{ p: 3 }}>
        <Stack padding="var(--space-3)" gap={2} display="flex" alignItems="center" mb={3}>
          <Box>
            <InfoOutlined />
          </Box>
          <Typography variant="h3" fontWeight={700}>
            {title}
          </Typography>
          <Typography variant="body2" mb={1}>
            <b>
              Safe{'{'}Pass{'}'}Partner third party app.{' '}
            </b>{' '}
            <br />
            By accessing third party applications provided by a partner of Safe
            {'{'}Pass{'}'} Program (&quot;Partner&quot; and/or &quot;Safe{'{'}Pass{'}'}Partner&quot;) you acknowledge
            and agree that Safe Ecosystem Foundation and/or Safe{'{'}Wallet{'}'} do not own, control, maintain, or audit
            these third party applications of Partner and that Safe Ecosystem Foundation and/or Safe{'{'}Wallet{'}'} may
            not be held liable for any loss you may incur in connection with your interaction with the Safe{'{'}Pass
            {'}'}Partner third party applications and/or programs and we may not be held liable for any and all legal,
            regulatory, and/or material defects related to the rewards and/or the reward programs provided by Safe{'{'}
            Pass{'}'}
            Partner. <br />
            <br />
            Safe{'{'}Pass{'}'}Partners are solely responsible for ensuring that their rewards and/or partner reward
            programs are operated in accordance with applicable laws and regulations and in accordance with their
            respective terms as published by Partner, including when such rewards are granted for your use of Partner
            services via your Safe Account, or when listed on our website and/or announced on our social media and the
            like. <br />
            <br />
            Please{' '}
            <ExternalLink href={SAFE_TERMS_AND_CONDITIONS_URL} sx={{ fontSize: '12px !important' }}>
              read our terms
            </ExternalLink>{' '}
            for further information.
          </Typography>
        </Stack>
        <Divider sx={{ ml: -3, mr: -3 }} />
        <Typography variant="body2" mt={3}>
          By clicking <i>Continue</i> you confirm to have read and understood our terms and this message, and agree to
          them.
        </Typography>
        <Box display="flex" justifyContent="center" gap={3} mt={3}>
          <Button variant="text" onClick={onCancel} color="secondary">
            Cancel
          </Button>
          <Button variant="contained" href={href} rel="noopener noreferrer" target="_blank" onClick={onAccept}>
            {buttonText}
          </Button>
        </Box>
      </Paper>
    </div>
  )
}

export default DisclaimerLink
