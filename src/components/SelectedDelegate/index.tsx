import { Button, Card, CardHeader, CircularProgress, Typography } from '@mui/material'
import type { ReactElement } from 'react'

import { DelegateAvatar } from '@/components/DelegateAvatar'
import Avatar from '@/public/images/avatar.svg'
import { InfoAlert } from '@/components/InfoAlert'
import { shortenAddress } from '@/utils/addresses'
import { useIsDelegationPending } from '@/hooks/usePendingDelegations'
import type { Delegate } from '@/hooks/useDelegate'

export const SelectedDelegate = ({
  onClick,
  delegate,
  disabled,
  hint = false,
}: {
  delegate?: Delegate
  onClick?: () => void
  disabled?: boolean
  hint?: boolean
}): ReactElement => {
  const shortAddress = delegate ? shortenAddress(delegate.address) : undefined
  const isDelegating = useIsDelegationPending()

  const title = isDelegating
    ? 'Delegating...'
    : delegate
    ? 'name' in delegate
      ? delegate.name
      : shortAddress
    : 'No delegate chosen'
  const subheader =
    delegate && !isDelegating ? ('ens' in delegate ? delegate.ens || shortAddress : shortAddress) : undefined

  return (
    <>
      <Typography color="text.secondary" alignSelf="flex-start" mb={1}>
        Delegating to
      </Typography>
      <Card variant="outlined" elevation={0}>
        <CardHeader
          avatar={isDelegating ? <CircularProgress /> : delegate ? <DelegateAvatar delegate={delegate} /> : <Avatar />}
          title={title}
          titleTypographyProps={{
            color: !delegate ? 'text.secondary' : undefined,
          }}
          subheader={subheader}
          action={
            onClick && (
              <Button variant="contained" size="stretched" onClick={onClick} disabled={isDelegating || disabled}>
                {delegate ? 'Redelegate' : 'Delegate'}
              </Button>
            )
          }
        />
      </Card>
      {hint && (
        <InfoAlert mt={2}>
          <Typography>You only delegate your voting power and not the ownership of your tokens.</Typography>
        </InfoAlert>
      )}
    </>
  )
}
