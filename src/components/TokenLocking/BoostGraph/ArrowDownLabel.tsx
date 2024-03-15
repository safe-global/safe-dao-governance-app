import { useTheme } from '@mui/material/styles'
import { Background, VictoryLabel, VictoryLabelProps, VictoryLabelStyleObject } from 'victory'

export const ArrowDownLabel = (props: VictoryLabelProps) => {
  const theme = useTheme()
  if (props.x === undefined || props.y === undefined || props.text === '') {
    return null
  }
  return (
    <>
      <rect
        style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
        fill={theme.palette.primary.main}
        width={8}
        height={8}
        transform="rotate(45)"
        x={props.x - 4}
        y={props.y - 16}
      />
      <VictoryLabel
        {...props}
        backgroundPadding={[8]}
        backgroundComponent={<Background rx={6} ry={6} />}
        backgroundStyle={[{ fill: theme.palette.primary.main }]}
        style={{ ...props.style, fill: theme.palette.background.main } as VictoryLabelStyleObject}
        dy={-36}
      />
    </>
  )
}
