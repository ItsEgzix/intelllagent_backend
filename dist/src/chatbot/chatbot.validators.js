"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWorkingHours = validateWorkingHours;
exports.findAgentByNameOrEmail = findAgentByNameOrEmail;
exports.calculateTimeDifference = calculateTimeDifference;
const timezone_helper_1 = require("../email/templates/timezone-helper");
function validateWorkingHours(date, time, timezone) {
    try {
        const [hours, minutes] = time.split(':').map(Number);
        if (isNaN(hours) ||
            isNaN(minutes) ||
            hours < 0 ||
            hours > 23 ||
            minutes < 0 ||
            minutes > 59) {
            return {
                valid: false,
                message: 'Invalid time format. Please use HH:mm format (e.g., 14:30).',
            };
        }
        const totalMinutes = hours * 60 + minutes;
        const startMinutes = 8 * 60 + 30;
        const endMinutes = 17 * 60 + 30;
        const lunchStart = 13 * 60;
        const lunchEnd = 14 * 60;
        if (totalMinutes < startMinutes || totalMinutes > endMinutes) {
            return {
                valid: false,
                message: `The selected time ${time} is outside working hours (8:30 - 17:30) in ${timezone}. Please select a time between 8:30 and 17:30.`,
            };
        }
        if (totalMinutes >= lunchStart && totalMinutes <= lunchEnd) {
            return {
                valid: false,
                message: `The selected time ${time} falls during lunch break (1:00 PM - 2:00 PM). Please select a different time.`,
            };
        }
        const dateTimeString = `${date}T${time}:00`;
        const dateObj = new Date(dateTimeString);
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            weekday: 'long',
        });
        const dayName = formatter.format(dateObj).toLowerCase();
        if (dayName === 'saturday' || dayName === 'sunday') {
            return {
                valid: false,
                message: 'Meetings cannot be scheduled on weekends (Saturday or Sunday). Please select a weekday.',
            };
        }
        return { valid: true };
    }
    catch (error) {
        console.error('Error validating working hours:', error);
        return {
            valid: false,
            message: 'Error validating working hours. Please check the date and time format.',
        };
    }
}
async function findAgentByNameOrEmail(nameOrEmail, agentsService) {
    try {
        if (!agentsService) {
            return null;
        }
        const agents = await agentsService.findActive();
        const agent = agents.find((a) => a.name?.toLowerCase() === nameOrEmail.toLowerCase() ||
            a.email.toLowerCase() === nameOrEmail.toLowerCase());
        return agent ? agent.id : null;
    }
    catch (error) {
        console.error('Error finding agent:', error);
        return null;
    }
}
function calculateTimeDifference(date, time, fromTimezone, toTimezone) {
    try {
        const fromResult = (0, timezone_helper_1.convertTimezone)(date, time, fromTimezone, toTimezone);
        const [fromHours, fromMinutes] = time.split(':').map(Number);
        const [toHours, toMinutes] = fromResult.time.split(':').map(Number);
        const fromTotal = fromHours * 60 + fromMinutes;
        const toTotal = toHours * 60 + toMinutes;
        const diffMinutes = toTotal - fromTotal;
        const diffHours = Math.floor(Math.abs(diffMinutes) / 60);
        const diffMins = Math.abs(diffMinutes) % 60;
        if (diffMinutes === 0) {
            return `Both timezones are the same.`;
        }
        const direction = diffMinutes > 0 ? 'ahead' : 'behind';
        const hoursText = diffHours > 0 ? `${diffHours} hour${diffHours > 1 ? 's' : ''}` : '';
        const minsText = diffMins > 0 ? `${diffMins} minute${diffMins > 1 ? 's' : ''}` : '';
        const diffText = [hoursText, minsText].filter(Boolean).join(' and ');
        return `The agent's timezone is ${diffText} ${direction} of your timezone.`;
    }
    catch (error) {
        console.error('Error calculating time difference:', error);
        return '';
    }
}
//# sourceMappingURL=chatbot.validators.js.map