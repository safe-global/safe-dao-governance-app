import { Grid, Typography, Box, Paper } from '@mui/material'
import Checkmark from '@mui/icons-material/Check'
import type { ReactElement, ReactNode } from 'react'

import { StepHeader } from '@/components/StepHeader'
import { ExternalLink } from '@/components/ExternalLink'
import { NavButtons } from '@/components/NavButtons'
import { DISCORD_URL, FORUM_URL, GOVERNANCE_URL, CHAIN_SNAPSHOT_URL } from '@/config/constants'
import { useChainId } from '@/hooks/useChainId'

import css from './styles.module.css'

const Point = ({ children }: { children: ReactNode }): ReactElement => {
  return (
    <Box display="inline-flex" gap={2}>
      <Checkmark />
      <Typography>{children}</Typography>
    </Box>
  )
}

const SafeDao = ({ onBack, onNext }: { onBack: () => void; onNext: () => void }): ReactElement => {
  const chainId = useChainId()

  const snapshotUrl = CHAIN_SNAPSHOT_URL[chainId]

  return (
    <Grid container px={6} pt={5} pb={4}>
      <Grid item xs={12} mb={3}>
        <StepHeader title="Navigating Safe{DAO}" />
      </Grid>

      <Typography mb={3}>
        Safe{`{DAO}`} aims to foster a vibrant ecosystem of applications and wallets leveraging Safe Accounts. This will
        be achieved through data-backed discussions, grants, ecosystem investments, as well as providing developer tools
        and infrastructure.
      </Typography>

      <Typography fontWeight={700} variant="h3" mb={3}>
        How to get involved:
      </Typography>

      <Box display="flex" flexDirection="column" gap={3} mb={3.5}>
        <Point>
          Discuss Safe{`{DAO}`} improvements - post topics and discuss in our{' '}
          <ExternalLink href={FORUM_URL}>Forum</ExternalLink>
        </Point>

        <Point>
          Propose improvements - read our <ExternalLink href={GOVERNANCE_URL}>governance process</ExternalLink> and post
          an &quot;SEP&quot;.
        </Point>

        <Point>
          Govern improvements - vote on our <ExternalLink href={snapshotUrl}>Snapshot</ExternalLink>.
        </Point>

        <Point>
          Chat with the community - join our <i>Safe</i> <ExternalLink href={DISCORD_URL}>Discord</ExternalLink>.
        </Point>

        <Paper className={css.info}>
          <Typography variant="h4" fontWeight={700}>
            Now&hellip;
            <br />
            Help decide on the future of ownership with SAFE.
          </Typography>
        </Paper>
      </Box>

      <NavButtons onBack={onBack} onNext={onNext} />
    </Grid>
  )
}

export default SafeDao
