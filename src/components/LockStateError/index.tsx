import { Alert } from '@mui/material'
import type { ReactElement } from 'react'

export const LockStateError = (): ReactElement => (
  <Alert severity="error">Couldn&apos;t load your locked SAFE. Please try again later.</Alert>
)
