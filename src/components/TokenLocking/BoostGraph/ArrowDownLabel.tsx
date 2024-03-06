import { Background, VictoryLabel, VictoryLabelProps } from 'victory'

export const ArrowDownLabel = (props: VictoryLabelProps) => {
  if (props.x === undefined || props.y === undefined || props.text === '') {
    return null
  }
  return (
    <>
      <rect
        style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
        fill="black"
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
        backgroundStyle={[{ fill: 'black' }]}
        dy={-36}
      />
    </>
  )
}
