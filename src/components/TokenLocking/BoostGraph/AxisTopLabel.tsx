import { formatDay } from '@/utils/date'
import { VictoryLabel, VictoryLabelProps } from 'victory'

export const AxisTopLabel = ({ startTime, ...props }: VictoryLabelProps & { startTime: number; datum?: number }) => {
  const days = props.datum

  if (days === undefined) {
    return null
  }

  const dateLabel = formatDay(days, startTime)

  return (
    <>
      <VictoryLabel
        {...props}
        dy={-8}
        style={{ ...props.style, fontWeight: 700, letterSpacing: '1px', fontSize: '11px' }}
      />
      <VictoryLabel {...props} dy={16} text={dateLabel} />
    </>
  )
}
