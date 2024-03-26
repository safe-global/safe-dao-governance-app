import { Link, Stack, Typography } from '@mui/material'
import { AppRoutes } from '@/config/routes'
import NextLink from 'next/link'
import { ChevronLeft, SignalCellularAlt, SignalCellularAlt2Bar } from '@mui/icons-material'
import PaperContainer from '@/components/PaperContainer'
import TokenBoost from '@/public/images/token-boost.png'
import Timefactor from '@/public/images/timefactor.png'
import Image from 'next/image'
import css from './styles.module.css'

const WhatIsBoost = () => {
  return (
    <Stack spacing={3}>
      <Link
        href={AppRoutes.activity}
        component={NextLink}
        sx={{ display: 'flex', alignItems: 'center', color: ({ palette }) => palette.primary.main }}
      >
        <ChevronLeft />
        Back to main
      </Link>

      <Typography variant="h1">What is Boost and how does it work?</Typography>

      <PaperContainer sx={{ width: '888px', px: '84px !important', py: '56px !important' }}>
        <Typography>
          You can multiply your Miles by locking SAFE. The more SAFE you lock and the longer you keep it locked, the
          higher your multiplier.
        </Typography>

        <Typography>Expressed as a mathematical formula, the total boost can be calculated as follows:</Typography>

        <Typography className={css.info}>
          <div className={css.signalWrapper}>
            <SignalCellularAlt color="border" fontSize="large" />
            <SignalCellularAlt2Bar color="primary" fontSize="large" />
          </div>
          Total boost = token boost * timefactor boost + 1
        </Typography>

        <Typography>
          The total boost consists of two components: the token boost and the timefactor boost. Let’s break these down
          further:
        </Typography>

        <Typography variant="h3" fontWeight="bold" mt={3}>
          Token boost
        </Typography>

        <Typography>
          This component depends on the amount of tokens you lock. You will be placed in one of 6 different tiers
          depending on how many tokens you lock. How the exact formula for the token boost works depends on the tier you
          are in.
        </Typography>

        <Image src={TokenBoost} alt="Token boost diagram" style={{ width: '100%', height: 'auto' }} />

        <Typography variant="h3" fontWeight="bold" mt={3}>
          Timefactor boost
        </Typography>

        <Typography>
          This component ensures that the earlier you lock, the higher your boost will be. Depending on when you lock,
          you will fall into a different tier that results in a different formula (similar to the above). However, all
          the formulae are time dependent. This means that every day you decide not to lock you will lose your potential
          boost compared to if you would have done so that day. You can see the formulae for the different tiers below.
        </Typography>

        <Typography mb={3}>
          We differentiate between a realised and expected final boost in our app. Realised boost is the boost you have
          already secured and which cannot be taken away by unlocking. This has no projection over time. The expected
          final boost is the boost you will get at the start of the distribution of rewards, assuming that you didn’t
          unlock or withdraw your tokens before.
        </Typography>

        <Image src={Timefactor} alt="Timefactor diagram" style={{ width: '100%', height: 'auto' }} />

        <Typography className={css.info} mt={3}>
          <div className={css.signalWrapper}>
            <SignalCellularAlt color="border" fontSize="large" />
            <SignalCellularAlt2Bar color="primary" fontSize="large" />
          </div>
          Note that only the final boost at the end of the season will be multiplied by all gained points.
        </Typography>
      </PaperContainer>
    </Stack>
  )
}

export default WhatIsBoost
