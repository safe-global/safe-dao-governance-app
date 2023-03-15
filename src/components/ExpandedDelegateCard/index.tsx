import { useMemo } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Button, Card, CardContent, CardHeader, IconButton, Typography } from '@mui/material'

import { DelegateAvatar } from '@/components/DelegateAvatar'
import { ExternalLink } from '@/components/ExternalLink'
import { useChain } from '@/hooks/useChain'
import { getHashedExplorerUrl } from '@/utils/gateway'
import { shortenAddress } from '@/utils/addresses'
import type { FileDelegate } from '@/hooks/useDelegatesFile'

export const ExpandedDelegateCard = ({
  onClick,
  delegate,
  onClose,
}: {
  onClick: (delegate: FileDelegate) => void
  delegate: FileDelegate
  onClose: () => void
}) => {
  const chain = useChain()

  const explorerUrl = useMemo(() => {
    if (!chain) {
      return ''
    }

    return getHashedExplorerUrl(delegate.address, chain.blockExplorerUriTemplate)
  }, [chain, delegate])

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={<DelegateAvatar delegate={delegate} />}
        action={
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
        title={delegate.name}
        subheader={<ExternalLink href={explorerUrl}>{delegate.ens || shortenAddress(delegate.address)}</ExternalLink>}
        sx={{ p: 0, m: 2 }}
      />
      <CardContent sx={{ p: '0 !important', m: 2 }}>
        <Typography fontWeight={700}>What are your reasons for wanting to be a delegate?</Typography>
        <Typography>{delegate.reason}</Typography>
        {delegate.contribution && (
          <>
            <Typography mt={2} fontWeight={700}>
              As a founding Guardian, what was your previous contribution?
            </Typography>
            <Typography sx={{ wordBreak: 'break-word' }}>{delegate.contribution}</Typography>
          </>
        )}

        <Button variant="contained" size="stretched" onClick={() => onClick(delegate)} sx={{ mt: 2 }}>
          Select as delegate
        </Button>
      </CardContent>
    </Card>
  )
}
