import { Grid, Typography, Button } from '@mui/material'
import type { ReactElement } from 'react'

import { useIsSafeApp } from '@/hooks/useIsSafeApp'
import SafeLogo from '@/public/images/safe-logo.svg'

const SuccessfulDelegation = ({ onNext }: { onNext: () => void }): ReactElement => {
  const isSafeApp = useIsSafeApp()

  return (
    <Grid container flexDirection="column" alignItems="center" pt={16} px={1} pb={22}>
      <SafeLogo alt="Safe{DAO} logo" width={125} height={110} />

      <Typography variant="h1" mt={6} mb={2}>
        Transaction has been created
      </Typography>

      <Typography mb={4} textAlign="center">
        {isSafeApp
          ? 'You successfully started delegating! Once the transaction is signed and executed, your voting power will be delegated.'
          : 'You successfully delegated your voting power!'}
      </Typography>

      <Button variant="contained" color="primary" onClick={onNext}>
        Back to main
      </Button>
    </Grid>
  )
}

export default SuccessfulDelegation
