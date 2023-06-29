import { OpenInNewRounded } from '@mui/icons-material'
import { Box, Chip, Typography, Skeleton, Card } from '@mui/material'
import type { ReactElement } from 'react'

import { FORUM_URL, CHAIN_SNAPSHOT_URL } from '@/config/constants'
import { ExternalLink } from '@/components/ExternalLink'
import { useSafeSnapshot } from '@/hooks/useSafeSnapshot'
import palette from '@/styles/colors'
import { useChainId } from '@/hooks/useChainId'
import type { SnapshotProposal } from '@/hooks/useSafeSnapshot'

import css from './styles.module.css'

const SNAPSHOT_STATE_COLORS: Record<SnapshotProposal['state'], string> = {
  active: 'success.main',
  pending: 'border.main',
  closed: '#743EE4',
}

export const _getProposalNumber = (title: string): string => {
  // Find anything that matches "SEP #n"
  const SEP_REGEX = /SEP\s#\d+/g
  return title.match(SEP_REGEX)?.[0] || ''
}

export const _getProposalTitle = (title: string): string => {
  // Find anything after "] " or ": "
  const TITLE_REGEX = /(\]|:) (.*)/
  return title.match(TITLE_REGEX)?.at(-1) || ''
}

const SnapshotProposals = ({
  proposals,
  snapshotLink,
}: {
  proposals: SnapshotProposal[]
  snapshotLink: string
}): ReactElement => (
  <>
    {proposals?.map((proposal) => (
      <a
        className={css.proposal}
        href={`${snapshotLink}/proposal/${proposal.id}`}
        key={proposal.id}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={css.number}>{_getProposalNumber(proposal.title)}</div>
        <div className={css.titleWrapper}>
          <Typography variant="body2" className={css.title}>
            {_getProposalTitle(proposal.title)}
          </Typography>
        </div>
        <Chip
          label={proposal.state}
          className={css.status}
          sx={{
            backgroundColor: SNAPSHOT_STATE_COLORS[proposal.state],
            color: palette.background.paper,
          }}
        />
        <div className={css.link}>
          <OpenInNewRounded fontSize="small" sx={{ color: 'text.primary' }} />
        </div>
      </a>
    ))}
  </>
)

export const SnapshotWidget = (): ReactElement => {
  const { data: proposals, isLoading } = useSafeSnapshot()
  const chainId = useChainId()

  const snapshotUrl = CHAIN_SNAPSHOT_URL[chainId]

  return (
    <Card elevation={0} sx={{ flexGrow: 1 }}>
      <Box className={css.snapshot}>
        <div>
          <Typography component="h2" variant="subtitle1" color="text.primary" className={css.header}>
            Latest proposals
          </Typography>
          <Box gap={1} width={1} className={css.list}>
            {isLoading || !proposals ? (
              Array.from(Array(3).keys()).map((key) => (
                <Skeleton key={key} variant="rounded" height="47px" width="100%" />
              ))
            ) : (
              <SnapshotProposals proposals={proposals} snapshotLink={snapshotUrl} />
            )}
          </Box>
        </div>
        <Box display="flex" gap={4}>
          <ExternalLink href={snapshotUrl} variant="subtitle1" textAlign="center">
            View all
          </ExternalLink>
          <ExternalLink href={FORUM_URL} variant="subtitle1" textAlign="center">
            Safe{`{DAO}`} Forum
          </ExternalLink>
        </Box>
      </Box>
    </Card>
  )
}
