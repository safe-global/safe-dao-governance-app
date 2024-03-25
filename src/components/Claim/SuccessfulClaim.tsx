import { Grid, Typography, Button } from '@mui/material'
import type { ReactElement } from 'react'
import { useSearchParams } from 'next/navigation'

import SafeLogo from '@/public/images/safe-logo.svg'

export type ClaimFlow = {
  claimedAmount: string
}

const SuccessfulClaim = ({ data, onNext }: { data: ClaimFlow; onNext: () => void }): ReactElement => {
  return (
    <Grid container flexDirection="column" alignItems="center" pt={16} px={12} pb={22}>
      <SafeLogo alt="Safe{DAO} logo" width={125} height={110} />

      <Typography variant="h1" mt={6} mb={2}>
        Congrats!
      </Typography>

      <Typography mb={4} textAlign="center">
        You successfully started claiming {data.claimedAmount || '0'} Safe Tokens!
        <br />
        Once the transaction is signed and executed, the Safe Tokens will be available in your Safe Account.
      </Typography>

      <Button variant="contained" onClick={onNext}>
        Back to main
      </Button>
    </Grid>
  )
}

export default SuccessfulClaim
