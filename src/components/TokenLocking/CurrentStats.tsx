import { Grid } from '@mui/material'
import { BigNumberish } from 'ethers'
import { TokenAmount } from '../TokenAmount'

export const CurrentStats = ({
  loading,
  safeBalance,
  currentlyLocked,
}: {
  safeBalance: BigNumberish
  currentlyLocked: BigNumberish
  loading: boolean
}) => {
  return (
    <Grid container direction="row" spacing={3} justifyContent="space-evenly">
      <Grid item xs={12} sm={6}>
        <TokenAmount amount={safeBalance} label="Available to lock" loading={loading} />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TokenAmount amount={currentlyLocked} label="Locked" loading={loading} />
      </Grid>
    </Grid>
  )
}
