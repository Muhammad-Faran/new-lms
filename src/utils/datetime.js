import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz'

export const timeZone = 'Asia/Karachi'
const dateTimePattern = 'yyyy-MM-dd HH:mm:ss'

export function fromUtc(dateTime, pattern = dateTimePattern) {
    if (!dateTime || dateTime === '') return null
    return formatInTimeZone(new Date(dateTime), timeZone, pattern)
}

export function toUtcIso(dateTime) {
    if (!dateTime || dateTime === '') return null
    return zonedTimeToUtc(new Date(dateTime), timeZone).toISOString()
}
