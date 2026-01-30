"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTimezone = convertTimezone;
exports.calculateKLTime = calculateKLTime;
function convertTimezone(date, time, fromTimezone, toTimezone) {
    try {
        const [year, month, day] = date.split('-').map(Number);
        const [hours, minutes] = time.split(':').map(Number);
        const dateTimeStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
        const tempDate = new Date(dateTimeStr);
        const sourceTimeStr = tempDate.toLocaleString('en-US', {
            timeZone: fromTimezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        const sourceMatch = sourceTimeStr.match(/(\d+)\/(\d+)\/(\d+),?\s*(\d+):(\d+)/);
        if (!sourceMatch) {
            throw new Error('Could not parse source timezone time');
        }
        const [_, sourceMonth, sourceDay, sourceYear, sourceHour, sourceMin] = sourceMatch.map(Number);
        const targetMinutes = hours * 60 + minutes;
        const currentMinutes = sourceHour * 60 + sourceMin;
        const offsetMinutes = targetMinutes - currentMinutes;
        const adjustedDate = new Date(tempDate.getTime() + offsetMinutes * 60 * 1000);
        const targetTimeStr = adjustedDate.toLocaleString('en-US', {
            timeZone: toTimezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        const targetMatch = targetTimeStr.match(/(\d+)\/(\d+)\/(\d+),?\s*(\d+):(\d+)/);
        if (!targetMatch) {
            throw new Error('Could not parse target timezone time');
        }
        const [__, targetMonth, targetDay, targetYear, targetHour, targetMin] = targetMatch.map(Number);
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
    }
    catch (e) {
        console.error('Error converting timezone:', e);
        throw new Error('Timezone conversion error');
    }
}
function calculateKLTime(date, time, timezone) {
    try {
        const result = convertTimezone(date, time, timezone, 'Asia/Kuala_Lumpur');
        return `${result.date} at ${result.time} (MYT)`;
    }
    catch (e) {
        console.error('Error calculating KL time:', e);
        return 'Timezone conversion error';
    }
}
//# sourceMappingURL=timezone-helper.js.map