import { useThemeProps } from '@mui/system'
import { Point, PointProps } from 'victory'
import { useTheme } from '@mui/material/styles'
import { FAKE_NOW } from '@/hooks/useLockHistory'
import { useState } from 'react'
import { ArrowDownLabel } from './ArrowDownLabel'
import { SEASON2_START } from './graphConstants'
import { floorNumber } from '@/utils/boost'

/**
 * Draws different circles based on the date
 * @param props
 * @returns
 */
export const ScatterDot = ({ backgroundColor, ...props }: PointProps & { backgroundColor: string }) => {
  const theme = useTheme()

  const [hovered, setHovered] = useState(false)

  // 39, 25, 12 ,6
  if (props.datum.x === FAKE_NOW) {
    return (
      <>
        <Point {...props} style={{ ...props.style, fill: 'rgba(255,255,255, 0.1)' }} size={18} />
        <Point {...props} style={{ ...props.style, fill: 'rgba(255,255,255, 0.2)' }} size={12} />
        <Point {...props} style={{ ...props.style, fill: theme.palette.background.paper }} size={6} />
        <Point {...props} style={{ ...props.style, fill: theme.palette.primary.main }} size={3} />
        <circle
          cx={props.x}
          cy={props.y}
          r={22}
          fill="transparent"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />
      </>
    )
  }
  return (
    <>
      <Point {...props} style={{ ...props.style, fill: theme.palette.background.paper }} size={6} />
      <Point
        {...props}
        style={{ ...props.style, fill: hovered ? theme.palette.primary.main : theme.palette.border.main }}
        size={3}
      />
      <circle
        cx={props.x}
        cy={props.y}
        r={10}
        fill="transparent"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {hovered && props.datum.x !== SEASON2_START && (
        <ArrowDownLabel
          style={{
            verticalAnchor: 'middle',
            textAnchor: 'middle',
            fontFamily: 'DM Sans',
            fontSize: 16,
            fill: theme.palette.text.primary,
          }}
          x={props.x}
          y={props.y}
          text={`${floorNumber(props.datum.y, 2)}x`}
          backgroundColor={backgroundColor}
        />
      )}
    </>
  )
}
