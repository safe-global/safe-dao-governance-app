import { formatDay } from '@/utils/date'
import { VictoryLabel, VictoryLabelProps } from 'victory'

export const AxisTopLabel = ({ startTime, ...props }: VictoryLabelProps & { startTime: number; datum?: number }) => {
  const days = props.datum

  if (days === undefined) {
    return null
  }

  const dateLabel = formatDay(days, startTime)

  const style = props.style && !Array.isArray(props.style) ? props.style : {}

  return (
    <>
      <VictoryLabel {...props} dy={0} style={{ ...style, fontSize: '12px' }} />
      <VictoryLabel {...props} dy={16} text={dateLabel} style={{ ...style, fontSize: '12px', fill: '#FFF' }} />
    </>
  )
}
