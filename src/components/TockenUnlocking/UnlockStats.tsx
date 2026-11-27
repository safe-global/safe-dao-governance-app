import { Grid } from '@mui/material'
import { BigNumberish } from 'ethers'

import { TokenAmount } from '../TokenAmount'

export const UnlockStats = ({
  currentlyLocked,
  unlockedTotal,
  loading,
}: {
  currentlyLocked: BigNumberish
  unlockedTotal: BigNumberish
  loading: boolean
}) => {
  return (
    <Grid container direction="row" spacing={2}>
      <Grid item xs={12} sm={6}>
        <TokenAmount amount={currentlyLocked} label="Locked" loading={loading} />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TokenAmount amount={unlockedTotal} label="Unlocked" loading={loading} />
      </Grid>
    </Grid>
  )
}
