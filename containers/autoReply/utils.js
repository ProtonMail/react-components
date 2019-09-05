import { c } from 'ttag';
import { findTimeZone, getUTCOffset, listTimeZones } from 'timezone-support';
import { getFormattedDaysOfMonth } from 'proton-shared/lib/date/date';

export const DAY_SECONDS = 24 * 60 * 60;
export const HOUR_SECONDS = 60 * 60;
export const MINUTES_SECONDS = 60;

export const AutoReplyDuration = {
    FIXED: 0,
    DAILY: 1,
    WEEKLY: 2,
    MONTHLY: 3,
    PERMANENT: 4
};

export const getDurationOptions = () => [
    {
        text: c('Option').t`Fixed duration`,
        value: AutoReplyDuration.FIXED
    },
    {
        text: c('Option').t`Repeat daily`,
        value: AutoReplyDuration.DAILY
    },
    {
        text: c('Option').t`Repeat weekly`,
        value: AutoReplyDuration.WEEKLY
    },
    {
        text: c('Option').t`Repeat monthly`,
        value: AutoReplyDuration.MONTHLY
    },
    {
        text: c('Option').t`Permanent`,
        value: AutoReplyDuration.PERMANENT
    }
];

export const getMatchingTimezone = (timezone, timezoneOptions) => {
    const fullMatch = timezoneOptions.find(({ value }) => {
        return value === timezone;
    });
    if (fullMatch) {
        return fullMatch;
    }
    // Can be stored as "Singapore", now expecting Asia/Singapore
    const otherMatch = timezoneOptions.find(({ value }) => {
        return value.includes(timezone);
    });
    if (otherMatch) {
        return otherMatch;
    }
};

/**
 * Get a list of all IANA time zones
 * @return {Array<Object>}      [{ text: 'Africa/Nairobi: UTC +03:00', value: 'Africa/Nairobi'}, ...]
 */
export const getTimeZoneOptions = () => {
    const dummyDate = new Date(); // recent date required for proper use

    return listTimeZones().map((name) => {
        const { offset } = getUTCOffset(dummyDate, findTimeZone(name));
        // offset comes with the opposite sign in the timezone-support library
        const sign = Math.sign(offset) === 1 ? '-' : '+';
        const minutes = `${Math.abs(offset % 60)}`;
        const hours = `${(Math.abs(offset) - minutes) / 60}`;
        const mm = minutes.length === 1 ? `0${minutes}` : `${minutes}`;
        const hh = hours.length === 1 ? `0${hours}` : `${hours}`;

        return {
            text: `${name}: UTC ${sign}${hh}:${mm}`,
            value: name
        };
    });
};

/**
 * Get a list with the days of the month and their
 * index position (in the week) according to current locale
 * @param {Object} options
 *
 * @return {Object}         [{ text: 'name of day', value: index position in week }]
 */
export const getDaysOfMonthOptions = (options) =>
    getFormattedDaysOfMonth('do', options).map((day, index) => ({
        text: c('Option').t`${day} of the month`,
        value: index
    }));
