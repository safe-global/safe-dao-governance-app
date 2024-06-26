import { floorNumber } from '@/utils/boost'
import { NorthRounded, SouthRounded } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { TypographyProps } from '@mui/material/Typography'
import BezierEasing from 'bezier-easing'
import { useState, useEffect, useRef } from 'react'
const easeInOut = BezierEasing(0.42, 0, 0.58, 1)
const DURATION = 1000
const SCALE_FACTOR = 0.15

const digitRotations: Record<number, number> = {
  [1]: 0,
  [2]: Math.random() * 6 - 3,
  [3]: Math.random() * 6 - 3,
  [4]: Math.random() * 6 - 3,
  [5]: Math.random() * 6 - 3,
}

const BoostCounter = ({
  value,
  direction,
  ...props
}: TypographyProps & { value: number; direction?: 'north' | 'south' }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [start, setStart] = useState(0)
  const [target, setTarget] = useState(0)

  const targetRef = useRef<number>(1)

  const [currentNumber, setCurrentNumber] = useState(target)

  const rotationRef = useRef<number>(0)

  const scale = 1 + Math.floor(currentNumber) * SCALE_FACTOR

  useEffect(() => {
    if (targetRef.current === target) {
      // No new target
      return
    }

    targetRef.current = target
    const startTime = new Date().getTime()
    const offset = target - start

    const startRotation = digitRotations[floorNumber(currentNumber, 0)]

    const tick = () => {
      setIsAnimating(true)
      const elapsed = new Date().getTime() - startTime

      // If the browser window is in the background / minimized it will optimize and not call the requestAnimationFrame until in foreground causing wrong numbers for progress.
      const progress = Math.min(elapsed / DURATION, 1)
      const easedProgress = easeInOut(progress)

      const newNumber = start + easedProgress * offset

      if (
        startRotation !== digitRotations[floorNumber(newNumber, 0)] &&
        rotationRef.current !== digitRotations[floorNumber(newNumber, 0)]
      ) {
        rotationRef.current = digitRotations[floorNumber(newNumber, 0)]
      }
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

  const digit = currentNumber.toString().slice(0, 1)
  const localeSeparator = (1.1).toLocaleString().charAt(1)
  const decimals = currentNumber.toString().slice(2).slice(0, 2)

  return (
    <Box display="inline-flex" gap="4px" alignItems="center">
      {direction === 'north' && <NorthRounded color="primary" sx={{ width: '32px', height: '32px' }} />}
      {direction === 'south' && <SouthRounded color="warning" sx={{ width: '32px', height: '32px' }} />}

      <Typography
        sx={{
          transform: `scale(${scale}) rotateZ(${isAnimating ? rotationRef.current : 0}deg)`,
          transition: 'transform 0.3s cubic-bezier(.1,1.5,.8,4)',
        }}
        fontSize="44px"
        {...props}
      >
        {digit}
      </Typography>
      <Typography fontSize="44px" {...props}>
        {decimals !== '' ? `${localeSeparator}${decimals}x` : 'x'}
      </Typography>
    </Box>
  )
}

export default BoostCounter
