import { SAFE_TERMS_AND_CONDITIONS_URL } from '@/config/constants'
import { Box, Typography } from '@mui/material'
import { ExternalLink } from '../ExternalLink'

const SafePassDisclaimer = () => {
  return (
    <Box>
      <Box px={{ xs: 4, md: 0 }}>
        <Typography variant="overline" fontWeight="bold" color="text.secondary">
          LEGAL DISCLAIMER
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Please note that residents in{' '}
          <ExternalLink href={SAFE_TERMS_AND_CONDITIONS_URL}>certain jurisdictions</ExternalLink> (including the United
          States) may not be eligible for the boost and rewards. This means that your boost might not be applied to
          certain reward types, e.g. token rewards such as Safe, and you might not be eligible to receive certain types
          of rewards.
          <br />
          PLEASE NOTE THAT SOLELY LOCKING YOUR SAFE TOKEN WITHOUT ACTIVELY PARTICIPATING IN ACTIVITIES DOES NOT QUALIFY
          YOU TO RECEIVE REWARDS.
          <br />
          <b>
            Please note that participating in the Safe{'{'}Pass{'}'} Program, collecting points and completing
            activities{' '}
          </b>
          DOES NOT GRANT YOU ANY CLAIM, CONTRACTUAL OR OTHERWISE, TO RECEIVE REWARDS.
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" px={{ xs: 4, md: 0 }}>
        For more information, see <ExternalLink href={SAFE_TERMS_AND_CONDITIONS_URL}>Terms and Conditions</ExternalLink>
      </Typography>
    </Box>
  )
}

export default SafePassDisclaimer
