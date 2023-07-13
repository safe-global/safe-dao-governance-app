import { Link } from '@mui/material'
import type { LinkProps } from '@mui/material'
import { CSSProperties, forwardRef, ReactElement } from 'react'

import LinkIcon from '@/public/images/link.svg'

const styles: CSSProperties = {
  marginLeft: '4px',
}

export const ExternalLink = forwardRef<HTMLAnchorElement, LinkProps & { icon?: boolean }>(
  ({ children, icon = true, ...props }, ref): ReactElement => {
    return (
      <Link rel="noopener noreferrer" target="_blank" display="inline-flex" alignItems="center" {...props} ref={ref}>
        {children}
        {icon && <LinkIcon style={styles} />}
      </Link>
    )
  },
)
ExternalLink.displayName = 'ExternalLink'
