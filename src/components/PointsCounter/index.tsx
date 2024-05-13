import { floorNumber } from '@/utils/boost'
import { NorthRounded, SouthRounded } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { TypographyProps } from '@mui/material/Typography'
import BezierEasing from 'bezier-easing'
import { useState, useEffect, useRef } from 'react'
const easeInOut = BezierEasing(0.42, 0, 0.58, 1)
const DURATION = 1000

const PointsCounter = ({
  value,
  direction,
  children,
  ...props
}: TypographyProps & { value: number; direction?: 'north' | 'south' }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [start, setStart] = useState(0)
  const [target, setTarget] = useState(0)

  const targetRef = useRef<number>(1)

  const [currentNumber, setCurrentNumber] = useState(target)

  const rotationRef = useRef<number>(0)

  useEffect(() => {
    if (targetRef.current === target) {
      // No new target
      return
    }

    targetRef.current = target
    const startTime = new Date().getTime()
    const offset = target - start

    const tick = () => {
      setIsAnimating(true)
      const elapsed = new Date().getTime() - startTime

      // If the browser window is in the background / minimized it will optimize and not call the requestAnimationFrame until in foreground causing wrong numbers for progress.
      const progress = Math.min(elapsed / DURATION, 1)
      const easedProgress = easeInOut(progress)

      const newNumber = start + easedProgress * offset
      setCurrentNumber(floorNumber(newNumber, 3))

      if (elapsed < DURATION && targetRef.current === target) {
        requestAnimationFrame(tick)
      } else {
        setIsAnimating(false)
        rotationRef.current = 0
      }
    }

    tick()
  }, [target, currentNumber, start])

  useEffect(() => {
    setStart(target)
    setTarget(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <Box display="inline-flex" gap="4px" alignItems="center">
      {direction === 'north' && <NorthRounded color="primary" sx={{ width: '32px', height: '32px' }} />}
      {direction === 'south' && <SouthRounded color="warning" sx={{ width: '32px', height: '32px' }} />}

      <Typography {...props}>
        {Math.floor(currentNumber)} {children}
      </Typography>
    </Box>
  )
}

export default PointsCounter
