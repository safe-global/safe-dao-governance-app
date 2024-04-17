import { ReactNode } from 'react'
import NextLink from 'next/link'
import { Box, Link, Stack, SvgIcon, Typography } from '@mui/material'
import { AppRoutes } from '@/config/routes'
import PaperContainer from '@/components//PaperContainer'
import { ExternalLink } from '@/components/ExternalLink'
import { ChevronLeft } from '@mui/icons-material'
import SafePass from '@/public/images/safe-pass.svg'
import UserIcon from '@/public/images/user.svg'
import TransactionsVolumeIcon from '@/public/images/transactions-volume.svg'
import TransactionsNumberIcon from '@/public/images/transactions-number.svg'
import AssetsStoredIcon from '@/public/images/assets-stored.svg'
import EmptyActivityIcon from '@/public/images/empty-activity.png'
import ChatBubble from '@/public/images/chatbubble.png'
import Image from 'next/image'

const ProgramItem = ({ title, description, icon }: { title: string; description: ReactNode; icon: ReactNode }) => {
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

const ActivityProgramList = () => {
  return (
    <Box maxWidth="888px">
      <Stack spacing={3}>
        <Link
          href={AppRoutes.activity}
          component={NextLink}
          sx={{ display: 'flex', alignItems: 'center', color: ({ palette }) => palette.primary.main }}
        >
          <ChevronLeft />
          Back to main
        </Link>

        <Typography variant="h1">Activity Program List</Typography>
        <PaperContainer>
          <Stack alignItems="center" gap={2} pt={6}>
            <Image src={ChatBubble} alt="Chat bubble" />

            <SvgIcon component={SafePass} inheritViewBox sx={{ width: '282px', height: 'auto', my: 2 }} />

            <Typography width="80%" textAlign="center">
              With the{' '}
              <Typography fontWeight="bold" display="inline">
                {'Safe {Pass} Program'}
              </Typography>{' '}
              you can earn Points by using your Safe Account. Some activities are rewarded throughout the entire season,
              some activities are only rewarded temporarily.
            </Typography>

            <ExternalLink href="">Learn more</ExternalLink>

            <Box display="flex" flexWrap="wrap" justifyContent="center">
              <ProgramItem
                icon={<UserIcon height="150px" alt="user icon" />}
                title="Weekly user"
                description="Transacting with your safe account on a weekly basis"
              />
              <ProgramItem
                icon={<TransactionsVolumeIcon height="150px" alt="arrows pointing left and right" />}
                title="Volume transacted"
                description="Volume of your transactions"
              />
              <ProgramItem
                icon={<TransactionsNumberIcon height="150px" alt="arrow pointing up with plus symbol" />}
                title="No. of transactions"
                description="The number of transactions made with your safe account"
              />
              <ProgramItem
                icon={<AssetsStoredIcon height="150px" alt="overlapping boxes" />}
                title="Assets stored"
                description="The total assets value in your safe account"
              />
              <ProgramItem
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

export default ActivityProgramList
