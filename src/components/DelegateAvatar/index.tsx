import { Avatar } from '@mui/material'
import type { ReactElement } from 'react'

import { GUARDIANS_IMAGE_URL } from '@/config/constants'
import type { Delegate } from '@/hooks/useDelegate'

export const DelegateAvatar = ({ delegate }: { delegate: Delegate }): ReactElement => {
  const initial = 'name' in delegate ? delegate.name[0] : delegate.ens ? delegate.ens[0] : delegate.address[2]

  return (
    <Avatar
      variant="circular"
      src={`${GUARDIANS_IMAGE_URL}/${delegate.address}_1x.png`}
      alt={'name' in delegate ? delegate.name : delegate.address}
    >
      {initial}
    </Avatar>
  )
}
