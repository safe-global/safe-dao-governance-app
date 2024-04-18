import { formatDay } from '@/utils/date'
import { VictoryLabel, VictoryLabelProps, VictoryLabelStyleObject } from 'victory'

export const AxisTopLabel = ({ startTime, ...props }: VictoryLabelProps & { startTime: number; datum?: number }) => {
  const days = props.datum

  if (days === undefined) {
    return null
  }

  const dateLabel = formatDay(days, startTime)

  return (
    <>
      <VictoryLabel {...props} dy={0} style={{ fontSize: '11px' }} />
      <VictoryLabel {...props} dy={16} text={dateLabel} style={{ fontSize: '11px', fill: '#FFF' }} />
    </>
  )
}
