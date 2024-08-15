import { Button, Dialog, Link } from '@mui/material'
import type { LinkProps } from '@mui/material'
import { CSSProperties, forwardRef, ReactElement, useState } from 'react'

import LinkIcon from '@/public/images/link.svg'
import Track from '../Track'
import { NAVIGATION_EVENTS } from '@/analytics/navigation'
import { localItem } from '@/services/storage/local'
import DisclaimerLink from '../DisclaimerLink'

const styles: CSSProperties = {
  marginLeft: '4px',
}

export const ExternalLink = forwardRef<
  HTMLAnchorElement,
  LinkProps & { href: string; icon?: boolean; variant?: string; isPartner?: boolean }
>(({ children, isPartner = false, icon = true, variant = 'link', href, ...props }, ref): ReactElement => {
  const DISCLAIMER_ACCEPTED_KEY = 'disclaimerAccepted'
  const disclaimerAccepted = localItem<boolean>(DISCLAIMER_ACCEPTED_KEY)

  const isDisclaimerAccepted = disclaimerAccepted.get()

  const [showDisclaimer, setShowDisclaimer] = useState(false)

  const triggerDisclaimer = !isDisclaimerAccepted && isPartner

  const onClick = triggerDisclaimer
    ? () => {
        setShowDisclaimer(true)
      }
    : undefined

  const onAccept = () => {
    setShowDisclaimer(false)
    disclaimerAccepted.set(true)
  }

  return (
    <>
      <Track {...NAVIGATION_EVENTS.OPEN_EXTERNAL_LINK} label={href}>
        {variant === 'button' ? (
          <Button
            rel="noopener noreferrer"
            variant="outlined"
            href={triggerDisclaimer ? '' : href}
            onClick={onClick}
            target="_blank"
            sx={props.sx}
          >
            {children}
            {icon && <LinkIcon style={styles} />}
          </Button>
        ) : (
          <Link
            rel="noopener noreferrer"
            href={triggerDisclaimer ? undefined : href}
            target="_blank"
            display="inline-flex"
            alignItems="center"
            onClick={onClick}
            {...props}
            ref={ref}
          >
            {children}
            {icon && <LinkIcon style={styles} />}
          </Link>
        )}
      </Track>
      <Dialog open={showDisclaimer} onClose={() => setShowDisclaimer(false)} fullWidth>
        <DisclaimerLink
          onCancel={() => setShowDisclaimer(false)}
          onAccept={onAccept}
          href={href}
          title="Disclaimer"
          buttonText="Continue"
        />
      </Dialog>
    </>
  )
})
ExternalLink.displayName = 'ExternalLink'
