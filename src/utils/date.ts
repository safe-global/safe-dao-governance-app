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

export const formatDatetime = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }

  return `${date.toLocaleString(undefined, options)}h`
}

export const formatDate = (date: Date, long = false) => {
  const options: Intl.DateTimeFormatOptions = {
    month: long ? 'long' : 'short',
    day: '2-digit',
  }

  return `${date.toLocaleString(undefined, options)}`
}

type UnitType = 'week' | 'day' | 'hour' | 'minute' | 'second'
// in miliseconds
const units: Record<UnitType, number> = {
  week: 7 * 24 * 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
}

var rtf = new Intl.RelativeTimeFormat('en', { numeric: 'always' })

export const getRelativeTime = (d1: Date, d2 = new Date()) => {
  var elapsed = d1.getTime() - d2.getTime()

  // "Math.abs" accounts for both "past" & "future" scenarios
  for (const unit in units) {
    const unitNumber = units[unit as UnitType]
    if (Math.abs(elapsed) >= unitNumber || unit == 'second') {
      return rtf.format(Math.round(elapsed / unitNumber), unit as UnitType)
    }
  }
}
