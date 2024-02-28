import { Box, Typography } from '@mui/material'
import { TypographyProps } from '@mui/material/Typography'
import BezierEasing from 'bezier-easing'
import { useState, useEffect, useRef } from 'react'
const easeInOut = BezierEasing(0.42, 0, 0.58, 1)
const DURATION = 1000

const digitRotations: Record<number, number> = {
  [1]: 0,
  [2]: Math.random() * 10 - 5,
  [3]: Math.random() * 10 - 5,
  [4]: Math.random() * 10 - 5,
  [5]: Math.random() * 10 - 5,
  [6]: Math.random() * 10 - 5,
  [7]: Math.random() * 10 - 5,
}

const roundNumber = (num: number, digits: number) => {
  const decimal = Math.pow(10, digits)
  return Math.round(num * decimal) / decimal
}

const floorNumber = (num: number, digits: number) => {
  const decimal = Math.pow(10, digits)
  return Math.floor(num * decimal) / decimal
}

const BoostCounter = ({ value, ...props }: TypographyProps & { value: number }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [start, setStart] = useState(0)
  const [target, setTarget] = useState(0)

  const targetRef = useRef<number>(1)

  const [currentNumber, setCurrentNumber] = useState(target)

  const rotationRef = useRef<number>(0)

  const scale = 1 + Math.floor(currentNumber) * 0.1

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
      setCurrentNumber(roundNumber(newNumber, 3))

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

  const digit = floorNumber(currentNumber, 0)

  const decimals = floorNumber(currentNumber, 2).toString().slice(2)

  return (
    <Box display="inline-flex" gap="4px">
      <Typography
        sx={{
          transform: `scale(${scale}) rotateZ(${isAnimating ? rotationRef.current : 0}deg)`,
          transition: 'transform 0.25s cubic-bezier(.1,1,1,5)',
        }}
        {...props}
      >
        {digit}
      </Typography>
      <Typography {...props}>{decimals !== '' ? `.${decimals}x` : 'x'}</Typography>
    </Box>
  )
}

export default BoostCounter

/**
 * 2,80
 * 2.
 * 2,80 * 100 = 280 % 100 = 80
 */
