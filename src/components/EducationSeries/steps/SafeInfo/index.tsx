import { Grid, Typography, Box } from '@mui/material'
import type { ReactElement } from 'react'

import LockIcon from '@/public/images/lock.svg'
import AssetsIcon from '@/public/images/assets.svg'
import { StepHeader } from '@/components/StepHeader'
import { NavButtons } from '@/components/NavButtons'
import { InfoBox } from '@/components/InfoBox'

const SafeInfo = ({ onNext }: { onNext: () => void }): ReactElement => {
  return (
    <Grid container px={6} pt={5} pb={4}>
      <Grid item xs={12} mb={3}>
        <StepHeader
          title={
            <>
              What is <i>Safe</i>?
            </>
          }
        />
      </Grid>

      <Typography mb={3}>
        <i>Safe</i> is critical infrastructure for Web3. It is a programmable wallet that enables secure management of
        digital assets, data and identity.
      </Typography>

      <Grid container mb={6} spacing={5}>
        <Grid item xs={12} sm={6}>
          <InfoBox>
            <Typography color="text.secondary" mb={1}>
              Total Safe Accounts created
            </Typography>
            <Box display="inline-flex" gap={1} alignItems="center">
              <LockIcon />
              <Typography variant="h3" fontWeight={700} ml={1}>
                &gt;1,000,000
              </Typography>
            </Box>
          </InfoBox>
        </Grid>

        <Grid item xs={12} sm={6}>
          <InfoBox>
            <Typography color="text.secondary" mb={1}>
              Total value protected
            </Typography>
            <Box display="inline-flex" gap={1} alignItems="center">
              <AssetsIcon />
              <Typography variant="h3" fontWeight={700}>
                $41B
              </Typography>
            </Box>
          </InfoBox>
        </Grid>
      </Grid>

      <Typography variant="h3" fontWeight={700} mb={2}>
        Why do we have a Token?
      </Typography>

      <Typography mb={5}>
        As critical web3 infrastructure, <i>Safe</i> needs to be a community-owned, censorship resistant project, with a
        committed ecosystem stewarding its decisions. A governance Token is needed to help coordinate this effort.
      </Typography>

      <NavButtons onNext={onNext} />
    </Grid>
  )
}

export default SafeInfo
