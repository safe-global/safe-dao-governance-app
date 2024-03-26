import { ChevronLeft } from '@mui/icons-material'
import { Link, Stack, Typography } from '@mui/material'
import PaperContainer from '../PaperContainer'
import NextLink from 'next/link'
import { AppRoutes } from '@/config/routes'

export const TOC = () => {
  return (
    <Stack spacing={3}>
      <Link href={AppRoutes.activity} component={NextLink} sx={{ display: 'flex', alignItems: 'center' }}>
        <ChevronLeft />
        Back to main
      </Link>
      <PaperContainer>
        <Stack>
          <Typography variant="h2">Terms and Conditions</Typography>
          <Typography>Some terms and conditions</Typography>
        </Stack>
      </PaperContainer>
    </Stack>
  )
}
