/**
 * Date Utility scripts
*/

import { parse32Int } from './Number';

/**
 * Calculates the number of days, hours and mins from start date to end date.
 * returns a negative value if the date is already passed and positive for incoming dates
 * @param {Date} startDate Start Date
 * @param {Date} endDate End Date
 * @returns {Object} {days: int, hours: int, minutes: int}
 */
export function timeBetweenDate(startDate, endDate) {
    const millisecondsBetween = endDate - startDate;

    const millisecondPerDay = 1000 * 60 * 60 * 24;

    const day = millisecondsBetween / millisecondPerDay;
    const hoursDecimal = day - parse32Int(day);
    const hours = hoursDecimal * 24;
    const minsDecimal = hours - parse32Int(hours);
    const mins = minsDecimal * 60;

    return {
        days: parse32Int(day),
        hours: parse32Int(hours) % 24,
        minutes: parse32Int(mins) % 60
    };
}


/**
 * calculate the relative date to displays the full date if the date is greater that 7 days ago
 * or if the date is still not passed
 * @param {Date} targetDate Target Date
 * @returns {String} the relative date
 */
export function relativeDateFromNow(targetDate) {
    const time = timeBetweenDate(Date.now(), targetDate);

    if (0 >= time.days && time.days >= -7 && 0 >= time.hours && 0 >= time.minutes) {
        const absTime = {
            days: Math.abs(time.days),
            hours: Math.abs(time.hours),
            minutes: Math.abs(time.minutes)
        };

        if (absTime.days > 0) {
            return `${absTime.days} day${absTime.days > 1 ? 's' : ''} ago`;
        }
        if (absTime.days === 0 && absTime.hours > 0) {
            return `${absTime.hours} hour${absTime.hours > 1 ? 's' : ''} ago`;
        }
        if (absTime.days === 0 && absTime.hours === 0) {
            return `${absTime.minutes} minute${absTime.minutes > 1 ? 's' : ''} ago`;
        }
    }

    return targetDate.toDateString();
}
