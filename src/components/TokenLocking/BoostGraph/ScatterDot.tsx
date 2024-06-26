import { Point, PointProps } from 'victory'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { ArrowDownLabel } from './ArrowDownLabel'
import { floorNumber } from '@/utils/boost'

/**
 * Draws different circles based on the date
 * @param props
 * @returns
 */
export const ScatterDot = ({
  today,
  backgroundColor,
  ...props
}: PointProps & { today: number; backgroundColor: string }) => {
  const theme = useTheme()

  const [hovered, setHovered] = useState(false)

  // 39, 25, 12 ,6
  if (props.datum.x === today) {
    return (
      <>
        <Point {...props} style={{ ...props.style, fill: 'rgba(255,255,255, 0.1)' }} size={18} />
        <Point {...props} style={{ ...props.style, fill: 'rgba(255,255,255, 0.2)' }} size={12} />
        <Point {...props} style={{ ...props.style, fill: theme.palette.background.paper }} size={6} />
        <Point {...props} style={{ ...props.style, fill: theme.palette.primary.main }} size={3} />
        <circle
          cx={props.x}
          cy={props.y}
          r={18}
          fill="transparent"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />
        {hovered && (
          <ArrowDownLabel
            style={{
              verticalAnchor: 'middle',
              textAnchor: 'middle',
              fontFamily: 'DM Sans',
              fontSize: 14,
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
        r={6}
        fill="transparent"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {hovered && (
        <ArrowDownLabel
          style={{
            verticalAnchor: 'middle',
            textAnchor: 'middle',
            fontFamily: 'DM Sans',
            fontSize: 14,
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
