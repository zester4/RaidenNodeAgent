import { format, utcToZonedTime } from 'date-fns-tz';
import { z } from 'zod';

//Zod schema for timezone validation
const timezoneSchema = z.string().min(1);

// Function to get the current date and time for a timezone
export function getDateTime(timezone: string): string {
    try {
        timezoneSchema.parse(timezone);
        const now = new Date();
        const zonedDate = utcToZonedTime(now, timezone);
        const dateTimeString = format(zonedDate, 'yyyy-MM-dd HH:mm:ss zzz', { timeZone: timezone });
        return `The current date and time in ${timezone} is ${dateTimeString}.`;
    } catch (error: any) {
        console.error("Error getting date time", error)
        return `Could not retrieve date and time information for ${timezone}. ${error.message}`;
    }
}