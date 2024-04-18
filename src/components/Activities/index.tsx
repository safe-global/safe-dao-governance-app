import { ReactNode } from 'react'
import NextLink from 'next/link'
import { Box, Link, Stack, SvgIcon, Typography } from '@mui/material'
import { AppRoutes } from '@/config/routes'
import PaperContainer from '@/components//PaperContainer'
import { ExternalLink } from '@/components/ExternalLink'
import { ChevronLeft } from '@mui/icons-material'
import SafePass from '@/public/images/safe-pass.svg'
import UserBustIcon from '@/public/images/user-bust.png'
import WeeklyUser from '@/public/images/weekly-user.png'
import TransactionsVolumeIcon from '@/public/images/transaction-volume.png'
import TransactionsNumberIcon from '@/public/images/transaction-number.png'
import AssetsStoredIcon from '@/public/images/assets-stored.png'
import EmptyActivityIcon from '@/public/images/empty-activity.png'
import Image from 'next/image'
import { SAFE_PASS_LANDING_PAGE } from '@/config/constants'

const ActivityItem = ({ title, description, icon }: { title: string; description: ReactNode; icon: ReactNode }) => {
  return (
    <Box
      textAlign="center"
      display="flex"
      flex="1"
      flexDirection="column"
      alignItems="center"
      maxWidth="310px"
      padding={5}
    >
      {icon}
      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" alignItems="center">
        {description}
      </Typography>
    </Box>
  )
}

const Activities = () => {
  return (
    <Box maxWidth="888px" margin="auto">
      <Stack spacing={3}>
        <Link
          href={AppRoutes.activity}
          component={NextLink}
          sx={{ display: 'flex', alignItems: 'center', color: ({ palette }) => palette.primary.main }}
        >
          <ChevronLeft />
          Back to main
        </Link>

        <Typography variant="h1">Eligible activities</Typography>
        <PaperContainer>
          <Stack alignItems="center" gap={2} pt={6}>
            <Image src={UserBustIcon} alt="User bust" />
            <SvgIcon component={SafePass} inheritViewBox sx={{ width: '282px', height: 'auto', my: 2 }} />

            <Typography width="80%" textAlign="center">
              With{' '}
              <Typography fontWeight="bold" display="inline">
                {'Safe {Pass}'}
              </Typography>{' '}
              you can earn Points by using your Safe Account. Some activities are rewarded throughout the entire season,
              some activities are only rewarded temporarily.
            </Typography>

            <ExternalLink href={SAFE_PASS_LANDING_PAGE}>Learn more about {'Safe {Pass}'}</ExternalLink>

            <Box display="flex" flexWrap="wrap" justifyContent="center">
              <ActivityItem
                icon={<Image src={WeeklyUser} alt="user icon" />}
                title="Weekly user"
                description="Transacting with your Safe Account on a weekly basis"
              />
              <ActivityItem
                icon={<Image src={TransactionsVolumeIcon} alt="arrows pointing left and right" />}
                title="Volume transacted"
                description="Volume of your transactions"
              />
              <ActivityItem
                icon={<Image src={TransactionsNumberIcon} alt="arrow pointing up with plus symbol" />}
                title="No. of transactions"
                description="The number of transactions made with your safe account"
              />
              <ActivityItem
                icon={<Image src={AssetsStoredIcon} alt="overlapping boxes" />}
                title="Assets stored"
                description="The total assets value in your Safe Account"
              />
              <ActivityItem
                icon={<Image src={EmptyActivityIcon} alt="Other activities placeholder" />}
                title="Other activities coming soon"
                description={
                  <>
                    To stay updated follow us on{' '}
                    <ExternalLink icon={false} href="https://twitter.com/safe">
                      X
                    </ExternalLink>{' '}
                    and{' '}
                    <ExternalLink icon={false} href="https://warpcast.com/safe">
                      Farcaster
                    </ExternalLink>
                  </>
                }
              />
            </Box>
          </Stack>
        </PaperContainer>
      </Stack>
    </Box>
  )
}

export default Activities