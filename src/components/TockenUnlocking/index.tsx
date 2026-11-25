import { Box, Link, Stack, Typography } from '@mui/material'
import { BigNumber } from 'ethers'

import NextLink from 'next/link'
import { AppRoutes } from '@/config/routes'
import PaperContainer from '../PaperContainer'
import { UnlockStats } from './UnlockStats'
import { UnlockTokenWidget } from './UnlockTokenWidget'
import { ChevronLeft } from '@mui/icons-material'

import { WithdrawWidget } from './WithdrawWidget'
import { NAVIGATION_EVENTS } from '@/analytics/navigation'
import Track from '../Track'
import { useLockState } from '@/hooks/useLockState'
import { LockStateError } from '@/components/LockStateError'

const ZERO = BigNumber.from(0)

const TokenUnlocking = () => {
  const { data, error, isLoading } = useLockState()

  // Keep showing the last good data if a background refresh fails.
  // Without data, locked and withdrawable fall back to 0, which disables both actions.
  const hasError = !!error && !data

  return (
    <Box maxWidth="888px">
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

        <Typography variant="h1">Unlock / Withdraw</Typography>

        {hasError && <LockStateError />}

        <PaperContainer>
          <UnlockStats
            currentlyLocked={data?.locked ?? ZERO}
            unlockedTotal={data?.unlocked ?? ZERO}
            loading={isLoading}
          />
        </PaperContainer>
        <PaperContainer>
          <UnlockTokenWidget currentlyLocked={data?.locked ?? ZERO} />
        </PaperContainer>
        <PaperContainer>
          <WithdrawWidget totalWithdrawable={data?.withdrawable ?? ZERO} pendingUnlocks={data?.pendingUnlocks} />
        </PaperContainer>
      </Stack>
    </Box>
  )
}

export default TokenUnlocking
