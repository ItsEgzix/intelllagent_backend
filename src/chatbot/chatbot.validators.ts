import { AgentsService } from '../agents/agents.service';
import { convertTimezone } from '../email/templates/timezone-helper';

/**
 * Validation result for working hours
 */
export interface WorkingHoursValidation {
  valid: boolean;
  message?: string;
}

/**
 * Validate working hours (8:30 to 17:30) in the given timezone
 * Excludes lunch break (13:00-14:00) and weekends
 */
export function validateWorkingHours(
  date: string,
  time: string,
  timezone: string,
): WorkingHoursValidation {
  try {
    // Parse time
    const [hours, minutes] = time.split(':').map(Number);

    // Validate time components
    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return {
        valid: false,
        message: 'Invalid time format. Please use HH:mm format (e.g., 14:30).',
      };
    }

    const totalMinutes = hours * 60 + minutes;

    // Working hours: 8:30 (510 minutes) to 17:30 (1050 minutes)
    const startMinutes = 8 * 60 + 30; // 8:30
    const endMinutes = 17 * 60 + 30; // 17:30

    // Lunch break: 13:00 (780 minutes) to 14:00 (840 minutes) - both inclusive
    const lunchStart = 13 * 60; // 13:00
    const lunchEnd = 14 * 60; // 14:00

    if (totalMinutes < startMinutes || totalMinutes > endMinutes) {
      return {
        valid: false,
        message: `The selected time ${time} is outside working hours (8:30 - 17:30) in ${timezone}. Please select a time between 8:30 and 17:30.`,
      };
    }

    // Check if it's during lunch break (1:00 PM - 2:00 PM, inclusive)
    if (totalMinutes >= lunchStart && totalMinutes <= lunchEnd) {
      return {
        valid: false,
        message: `The selected time ${time} falls during lunch break (1:00 PM - 2:00 PM). Please select a different time.`,
      };
    }

    // Check if it's a weekend (Saturday or Sunday) in the customer's timezone
    // Create a date string in ISO format and parse it
    const dateTimeString = `${date}T${time}:00`;

    // Use Intl.DateTimeFormat to get the day of week in the customer's timezone
    const dateObj = new Date(dateTimeString);
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
    });
    const dayName = formatter.format(dateObj).toLowerCase();

    if (dayName === 'saturday' || dayName === 'sunday') {
      return {
        valid: false,
        message:
          'Meetings cannot be scheduled on weekends (Saturday or Sunday). Please select a weekday.',
      };
    }

    return { valid: true };
  } catch (error) {
    console.error('Error validating working hours:', error);
    return {
      valid: false,
      message:
        'Error validating working hours. Please check the date and time format.',
    };
  }
}

/**
 * Find agent by name or email
 */
export async function findAgentByNameOrEmail(
  nameOrEmail: string,
  agentsService: AgentsService,
): Promise<string | null> {
  try {
    if (!agentsService) {
      return null;
    }

    const agents = await agentsService.findActive();
    const agent = agents.find(
      (a) =>
        a.name?.toLowerCase() === nameOrEmail.toLowerCase() ||
        a.email.toLowerCase() === nameOrEmail.toLowerCase(),
    );
    return agent ? agent.id : null;
  } catch (error) {
    console.error('Error finding agent:', error);
    return null;
  }
}

/**
 * Calculate and format time difference between two timezones
 */
export function calculateTimeDifference(
  date: string,
  time: string,
  fromTimezone: string,
  toTimezone: string,
): string {
  try {
    const fromResult = convertTimezone(date, time, fromTimezone, toTimezone);
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
    const hoursText =
      diffHours > 0 ? `${diffHours} hour${diffHours > 1 ? 's' : ''}` : '';
    const minsText =
      diffMins > 0 ? `${diffMins} minute${diffMins > 1 ? 's' : ''}` : '';
    const diffText = [hoursText, minsText].filter(Boolean).join(' and ');

    return `The agent's timezone is ${diffText} ${direction} of your timezone.`;
  } catch (error) {
    console.error('Error calculating time difference:', error);
    return '';
  }
}
