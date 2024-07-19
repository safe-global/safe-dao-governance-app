import { Button, Link } from '@mui/material'
import type { LinkProps } from '@mui/material'
import { CSSProperties, forwardRef, ReactElement } from 'react'

import LinkIcon from '@/public/images/link.svg'
import Track from '../Track'
import { NAVIGATION_EVENTS } from '@/analytics/navigation'

const styles: CSSProperties = {
  marginLeft: '4px',
}

export const ExternalLink = forwardRef<
  HTMLAnchorElement,
  LinkProps & { href: string; icon?: boolean; variant?: string }
>(({ children, icon = true, variant = 'link', href, ...props }, ref): ReactElement => {
  return (
    <Track {...NAVIGATION_EVENTS.OPEN_EXTERNAL_LINK} label={href}>
      {variant === 'button' ? (
        <Button rel="noopener noreferrer" variant="outlined" href={href} target="_blank" sx={props.sx}>
          {children}
          {icon && <LinkIcon style={styles} />}
        </Button>
      ) : (
        <Link
          rel="noopener noreferrer"
          href={href}
          target="_blank"
          display="inline-flex"
          alignItems="center"
          {...props}
          ref={ref}
        >
          {children}
          {icon && <LinkIcon style={styles} />}
        </Link>
      )}
    </Track>
  )
})
ExternalLink.displayName = 'ExternalLink'
