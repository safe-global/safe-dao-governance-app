import { Box, Grid, Stack, Typography } from '@mui/material'
import { ActionNavigation } from './ActionNavigation/ActionNavigation'
import PaperContainer from '../PaperContainer'
import { useLockState } from '@/hooks/useLockState'

import css from './styles.module.css'
import { ExternalLink } from '../ExternalLink'
import SafePassDisclaimer from '../SafePassDisclaimer'
import { TokenAmount } from '@/components/TokenAmount'
import { LockStateError } from '@/components/LockStateError'

const TokenLocking = () => {
  const { data, error, isLoading } = useLockState()

  // Keep showing the last good data if a background refresh fails
  const hasError = !!error && !data
  const hasTokensInContract = !!data && data.locked.add(data.unlocked).gt(0)

  return (
    <Grid container spacing={3}>
      <Grid
        item
        xs={12}
        lg={8}
        mt={4}
        mb={1}
        className={css.pageTitle}
        display="flex"
        flexDirection="row"
        alignItems="center"
      >
        <Typography variant="h2">{'Safe{Pass} has concluded'}</Typography>
        <Box ml="auto">
          <ExternalLink href="https://safe.global/pass">{'What is Safe{Pass}'}</ExternalLink>
        </Box>
      </Grid>

      <Grid item xs={12} lg={8}>
        <Stack spacing={3}>
          <PaperContainer>
            {hasError ? (
              <LockStateError />
            ) : data ? (
              <Typography>
                {hasTokensInContract
                  ? 'Make sure to unlock any remaining tokens.'
                  : 'You have no SAFE in the Safe{Pass} lock contract.'}
              </Typography>
            ) : null}

            <TokenAmount amount={data?.locked ?? 0} label="Locked" loading={isLoading} />

            <ActionNavigation disabled={hasError || !hasTokensInContract} />
          </PaperContainer>
          <SafePassDisclaimer />
        </Stack>
      </Grid>
    </Grid>
  )
}

export default TokenLocking
