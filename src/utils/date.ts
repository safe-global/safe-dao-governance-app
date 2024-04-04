const DAY = 60 * 60 * 24
const HOUR = 60 * 60
const MINUTE = 60

export const timeRemaining = (timestampInSeconds: number) => {
  let remainingSeconds = Math.max(0, timestampInSeconds - Date.now() / 1000)
  const days = Math.floor(remainingSeconds / DAY)
  remainingSeconds = remainingSeconds % DAY
  const hours = Math.floor(remainingSeconds / HOUR)
  remainingSeconds = remainingSeconds % HOUR
  const minutes = Math.floor(remainingSeconds / MINUTE)
  const seconds = remainingSeconds % MINUTE

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}

const MONTH_LABEL: Record<number, string> = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
}

export const formatDay = (days: number, start: number) => {
  const date = new Date(start + days * DAY * 1000)
  const month = date.getMonth()
  const day = date.getDate()

  return `${MONTH_LABEL[month]} ${day}`
}

export const DAY_IN_MS = 1000 * 60 * 60 * 24

export const isGreater24HoursDiff = (timestamp1: number, timestamp2: number) => {
  return Math.abs(timestamp1 - timestamp2) > DAY_IN_MS
}

export const toDaysSinceStart = (timestamp: number, start: number) => {
  return Math.floor((timestamp - start) / DAY_IN_MS)
}

export const getCurrentDays = (startTime: number) => toDaysSinceStart(Date.now(), startTime)

export const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }

  return `${date.toLocaleString(undefined, options)}h`
}
