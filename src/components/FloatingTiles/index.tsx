import { Box } from '@mui/material'
import styled from '@emotion/styled'
import { useRef, useEffect, useMemo, useState } from 'react'

import css from './styles.module.css'

const DIMENSIONS = 1000
const RADIUS = 40 // Percentage
const MIN_SIZE = 20
const MAX_SIZE = 50
const VARIANCE_FACTOR = 4
const ANIMATION_DURATION = '90s'

// Uses Box Muller transform to generate a 0,1 gaussian
const randomGaussian = () => {
  const u = 1 - Math.random()
  const v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

const randomPointOnCircle = () => {
  const angle = Math.random() * Math.PI * 2
  const adjustedRadius = RADIUS + VARIANCE_FACTOR * randomGaussian()
  const x = Math.cos(angle) * adjustedRadius + 50
  const y = Math.sin(angle) * adjustedRadius + 50
  return [x, y]
}

const Orbit = styled(Box)`
  width: ${DIMENSIONS}px;
  height: ${DIMENSIONS}px;
  z-index: -1;
  margin: auto;
  opacity: 70%;
  overflow: visible;
  animation: 2s ease-in-out 1 grow, ${ANIMATION_DURATION} linear 2s infinite orbit;

  @keyframes grow {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes orbit {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Tone down the animation to avoid vestibular motion triggers */
  @media (prefers-reduced-motion) {
    animation-name: none;
  }
`

const TileBox = styled(Box)`
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-delay: 2s;
  animation-name: anti-orbit;
  animation-duration: ${ANIMATION_DURATION};
  position: absolute;

  @keyframes anti-orbit {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(-180deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }

  /* Tone down the animation to avoid vestibular motion triggers */
  @media (prefers-reduced-motion) {
    animation-name: none;
  }
`

const Tile = ({
  top,
  left,
  size,
  startTime,
}: {
  top: string
  left: string
  size: string
  startTime: number | undefined | null
}) => {
  const tileRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const animation = tileRef.current?.getAnimations()[0]
    if (animation && startTime) {
      animation.startTime = startTime
    }
  }, [startTime, tileRef])

  return (
    <TileBox ref={tileRef} left={left} width={size} height={size} top={top}>
      <div className={css.spacer} />
    </TileBox>
  )
}

export const FloatingTiles = ({ tiles }: { tiles: number }) => {
  const orbitRef = useRef<HTMLElement>(null)
  const [animationStartTime, setAnimationStartTime] = useState<number | null>()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!animationStartTime) {
        setAnimationStartTime(orbitRef.current?.getAnimations()[0]?.startTime)
      }
    }, 0)

    return () => {
      clearTimeout(timer)
    }
  }, [animationStartTime, orbitRef])

  const tilesArr: {
    top: string
    left: string
    size: string
  }[] = useMemo(() => {
    return Array.apply('', Array(tiles)).map(() => {
      const [x, y] = randomPointOnCircle()

      const top = `${x.toFixed(2)}%`
      const left = `${y.toFixed(2)}%`

      const size = `${(Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE).toFixed(2)}px`

      return {
        top,
        left,
        size,
      }
    })
  }, [tiles])

  return (
    <div className={css.container}>
      <Orbit ref={orbitRef}>
        {tilesArr.map((tile, i) => (
          <Tile key={i} {...tile} startTime={animationStartTime} />
        ))}
      </Orbit>
    </div>
  )
}
