/**
 * Calculate the time in Kuala Lumpur timezone from a given date, time, and source timezone
 * Uses JavaScript's Intl API to dynamically calculate timezone conversions
 * Works with any IANA timezone without needing a hardcoded list
 * @param date - Date string in YYYY-MM-DD format
 * @param time - Time string in HH:mm format
 * @param timezone - IANA timezone string (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo')
 * @returns Formatted string with KL time in YYYY-MM-DD at HH:mm (MYT) format
 */
/**
 * Convert time from one timezone to another
 * @param date - Date string in YYYY-MM-DD format
 * @param time - Time string in HH:mm format
 * @param fromTimezone - Source IANA timezone string
 * @param toTimezone - Target IANA timezone string
 * @returns Object with date, time, and timezone in target timezone
 */
export function convertTimezone(
  date: string,
  time: string,
  fromTimezone: string,
  toTimezone: string,
): { date: string; time: string; timezone: string } {
  try {
    // Parse the input date and time
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);

    // Create a date string in ISO format
    const dateTimeStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

    // Create a date object (this will be interpreted as local server time, but we'll adjust)
    const tempDate = new Date(dateTimeStr);

    // Get what time this date shows in the source timezone
    const sourceTimeStr = tempDate.toLocaleString('en-US', {
      timeZone: fromTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    // Parse the source timezone representation
    const sourceMatch = sourceTimeStr.match(
      /(\d+)\/(\d+)\/(\d+),?\s*(\d+):(\d+)/,
    );
    if (!sourceMatch) {
      throw new Error('Could not parse source timezone time');
    }

    const [_, sourceMonth, sourceDay, sourceYear, sourceHour, sourceMin] =
      sourceMatch.map(Number);

    // Calculate the offset needed to adjust the date
    const targetMinutes = hours * 60 + minutes;
    const currentMinutes = sourceHour * 60 + sourceMin;
    const offsetMinutes = targetMinutes - currentMinutes;

    // Adjust the date to get the correct UTC time
    const adjustedDate = new Date(
      tempDate.getTime() + offsetMinutes * 60 * 1000,
    );

    // Format the adjusted date in target timezone
    const targetTimeStr = adjustedDate.toLocaleString('en-US', {
      timeZone: toTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    // Parse the target time string
    const targetMatch = targetTimeStr.match(
      /(\d+)\/(\d+)\/(\d+),?\s*(\d+):(\d+)/,
    );
    if (!targetMatch) {
      throw new Error('Could not parse target timezone time');
    }

    const [__, targetMonth, targetDay, targetYear, targetHour, targetMin] =
      targetMatch.map(Number);

    // Format the result
    const yyyy = targetYear;
    const mm = String(targetMonth).padStart(2, '0');
    const dd = String(targetDay).padStart(2, '0');
    const hh = String(targetHour).padStart(2, '0');
    const min = String(targetMin).padStart(2, '0');

    return {
      date: `${yyyy}-${mm}-${dd}`,
      time: `${hh}:${min}`,
      timezone: toTimezone,
    };
  } catch (e) {
    console.error('Error converting timezone:', e);
    throw new Error('Timezone conversion error');
  }
}

/**
 * Calculate the time in Kuala Lumpur timezone from a given date, time, and source timezone
 * Uses JavaScript's Intl API to dynamically calculate timezone conversions
 * Works with any IANA timezone without needing a hardcoded list
 * @param date - Date string in YYYY-MM-DD format
 * @param time - Time string in HH:mm format
 * @param timezone - IANA timezone string (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo')
 * @returns Formatted string with KL time in YYYY-MM-DD at HH:mm (MYT) format
 */
export function calculateKLTime(
  date: string,
  time: string,
  timezone: string,
): string {
  try {
    const result = convertTimezone(date, time, timezone, 'Asia/Kuala_Lumpur');
    return `${result.date} at ${result.time} (MYT)`;
  } catch (e) {
    console.error('Error calculating KL time:', e);
    return 'Timezone conversion error';
  }
}
