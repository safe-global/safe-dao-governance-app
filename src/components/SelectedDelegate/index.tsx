import { Button, Card, CardHeader, CircularProgress, Typography } from '@mui/material'
import type { ReactElement } from 'react'

import { DelegateAvatar } from '@/components/DelegateAvatar'
import Avatar from '@/public/images/avatar.svg'
import { InfoAlert } from '@/components/InfoAlert'
import { shortenAddress } from '@/utils/addresses'
import { useIsDelegationPending } from '@/hooks/usePendingDelegations'
import type { Delegate } from '@/hooks/useDelegate'

const getTitles = (isDelegating: boolean, delegate?: Delegate, shouldShorten?: boolean) => {
  if (isDelegating) {
    return {
      title: 'Delegating...',
      subheader: undefined,
    }
  }

  if (!delegate) {
    return {
      title: 'No delegate chosen',
      subheader: undefined,
    }
  }

  const address = shouldShorten ? shortenAddress(delegate.address) : delegate.address

  if ('name' in delegate) {
    return {
      title: delegate.name,
      subheader: address,
    }
  }

  if (delegate.ens) {
    return {
      title: delegate.ens,
      subheader: address,
    }
  }

  return {
    title: address,
    subheader: undefined,
  }
}

export const SelectedDelegate = ({
  onClick,
  delegate,
  disabled,
  hint = false,
}: {
  delegate?: Delegate
  onClick?: () => void
  disabled?: boolean
  hint?: Boolean
}): ReactElement => {
  const isDelegating = useIsDelegationPending()
  const { title, subheader } = getTitles(isDelegating, delegate, !!onClick)

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
