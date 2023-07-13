import { Card, CardHeader, CardHeaderProps, CircularProgress, Theme, Typography, useMediaQuery } from '@mui/material'
import type { ReactElement } from 'react'

import { DelegateAvatar } from '@/components/DelegateAvatar'
import Avatar from '@/public/images/avatar.svg'
import { InfoAlert } from '@/components/InfoAlert'
import { shortenAddress } from '@/utils/addresses'
import { useIsDelegationPending } from '@/hooks/usePendingDelegations'
import type { Delegate } from '@/hooks/useDelegate'

import css from './styles.module.css'

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
  delegate,
  hint = false,
  shortenAddress = false,
  action,
}: {
  delegate?: Delegate
  hint?: boolean
  shortenAddress?: boolean
  action?: CardHeaderProps['action']
}): ReactElement => {
  const isDelegating = useIsDelegationPending()
  const isSmallScreen = useMediaQuery(({ breakpoints }: Theme) => breakpoints.only('xs'))
  const { title, subheader } = getTitles(isDelegating, delegate, shortenAddress || isSmallScreen)

  return (
    <>
      <Typography className={css.title} mb={1}>
        Delegating to
      </Typography>
      <Card variant="outlined" elevation={0}>
        <CardHeader
          sx={({ breakpoints }) => ({
            '& .MuiCardHeader-avatar': {
              [breakpoints.only('xs')]: { display: 'none' },
            },
          })}
          avatar={isDelegating ? <CircularProgress /> : delegate ? <DelegateAvatar delegate={delegate} /> : <Avatar />}
          title={title}
          titleTypographyProps={{
            color: !delegate ? 'text.secondary' : undefined,
          }}
          subheader={subheader}
          action={action}
          className={css.header}
        />
      </Card>
      {hint && (
        <InfoAlert mt={2}>
          <Typography variant="body2">
            You only delegate your voting power and not the ownership of your Safe Tokens.
          </Typography>
        </InfoAlert>
      )}
    </>
  )
}
