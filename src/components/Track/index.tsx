import { trackSafeAppEvent } from '@/utils/analytics'
import type { ReactElement } from 'react'
import { Fragment, useEffect, useRef } from 'react'

type Props = {
  children: ReactElement
  as?: 'span' | 'div'
  action: string
  label?: string
}

const shouldTrack = (el: HTMLDivElement) => {
  const disabledChildren = el.querySelectorAll('*[disabled]')
  return disabledChildren.length === 0
}

const Track = ({ children, as: Wrapper = 'span', ...trackData }: Props): typeof children => {
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!el.current) {
      return
    }

    const trackEl = el.current

    const handleClick = () => {
      if (shouldTrack(trackEl)) {
        trackSafeAppEvent(trackData.action, trackData.label)
      }
    }

    // We cannot use onClick as events in children do not always bubble up
    trackEl.addEventListener('click', handleClick)
    return () => {
      trackEl.removeEventListener('click', handleClick)
    }
  }, [el, trackData])

  if (children.type === Fragment) {
    throw new Error('Fragments cannot be tracked.')
  }

  return (
    <Wrapper data-track={trackData.action} ref={el}>
      {children}
    </Wrapper>
  )
}

export default Track
