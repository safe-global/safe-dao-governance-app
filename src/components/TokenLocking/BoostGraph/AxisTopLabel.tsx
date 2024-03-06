import { formatDay } from '@/utils/date'
import { VictoryLabel } from 'victory'

export const AxisTopLabel = (props: any) => {
  const days: number = props.datum

  const dateLabel = formatDay(days)

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
