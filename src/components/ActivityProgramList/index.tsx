import { Box, Link, Stack, SvgIcon, Typography } from '@mui/material'

import NextLink from 'next/link'
import { AppRoutes } from '@/config/routes'
import PaperContainer from '../PaperContainer'
import { ChevronLeft } from '@mui/icons-material'
import SafeExplorers from '@/public/images/safe-explorers.svg'
import ChatBubble from '@/public/images/chatbubble.png'
import Image from 'next/image'

import { WithdrawWidget } from './WithdrawWidget'

const ProgramItem = ({ title, description }: { title: string; description: string }) => {
  return (
    <Box
      textAlign="center"
      display="flex"
      flex="1"
      flexDirection="column"
      alignItems="center"
      maxWidth="300px"
      padding={4}
    >
      <Image src={ChatBubble} alt="Token boost diagram" />

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
          <Stack alignItems="center" gap={2} py={8}>
            <Image src={ChatBubble} alt="Token boost diagram" />

            <SvgIcon component={SafeExplorers} inheritViewBox sx={{ width: '282px', height: 'auto', my: 2 }} />

            <Typography width="80%" textAlign="center">
              With the{' '}
              <Typography fontWeight="bold" display="inline">
                {'Safe {Pass} Program'}
              </Typography>{' '}
              you can earn Points by using your Safe Account. Some activities are rewarded throughout the entire season,
              some activities are only rewarded temporary.
            </Typography>

            <Box display="flex" flexWrap="wrap" justifyContent="center" mt={4}>
              <ProgramItem title="Weekly user" description="Transacting with your safe account on a weekly basis" />
              <ProgramItem title="Volume transacted" description="Volume of your transactions" />
              <ProgramItem
                title="No. of transactions"
                description="The number of transactions made with your safe account"
              />
              <ProgramItem title="Assets stored" description="The total assets value in your safe account" />
              <ProgramItem
                title="Other activities coming soon"
                description="To stay updated follow us on Twitter and Farcaster"
              />
            </Box>
          </Stack>
        </PaperContainer>
      </Stack>
    </Box>
  )
}

export default ActivityProgramList
