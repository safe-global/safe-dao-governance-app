import { ChevronLeft } from '@mui/icons-material'
import { Link, Stack, Typography } from '@mui/material'
import PaperContainer from '../PaperContainer'
import NextLink from 'next/link'
import { AppRoutes } from '@/config/routes'
import { NAVIGATION_EVENTS } from '@/analytics/navigation'
import Track from '../Track'

export const TermsAndConditions = () => {
  return (
    <Stack spacing={3}>
      <Track {...NAVIGATION_EVENTS.OPEN_LOCKING} label="other page">
        <Link
          href={AppRoutes.activity}
          component={NextLink}
          sx={{ display: 'flex', alignItems: 'center', color: ({ palette }) => palette.primary.main }}
        >
          <ChevronLeft />
          Back to main
        </Link>
      </Track>
      <PaperContainer>
        <Stack>
          <Typography variant="h2">Terms and Conditions</Typography>
          <Typography>Some terms and conditions</Typography>
        </Stack>
      </PaperContainer>
    </Stack>
  )
}
