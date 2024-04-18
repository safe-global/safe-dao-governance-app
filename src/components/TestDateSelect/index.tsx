import type { ReactElement } from 'react'

import { IS_PRODUCTION } from '@/config/constants'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { startDateStore, useStartDate } from '@/hooks/useStartDates'

export const TestDateSelect = (): ReactElement | null => {
  const { startTime } = useStartDate()

  const onDateSelect = (date: Date | null) => {
    if (date) {
      const timestamp = date.getTime()

      startDateStore.setStore(timestamp)
    }
  }

  if (IS_PRODUCTION) {
    return null
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        value={new Date(startTime)}
        onChange={(value) => onDateSelect(value)}
        slotProps={{ textField: { size: 'small' } }}
        label="start date"
      />
    </LocalizationProvider>
  )
}
