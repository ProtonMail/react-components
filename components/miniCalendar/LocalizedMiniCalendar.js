import React, { useMemo } from 'react';
import { c } from 'ttag';
import { getFormattedMonths, getFormattedWeekdays, getWeekStartsOn } from 'proton-shared/lib/date/date';
import { dateLocale } from 'proton-shared/lib/i18n';
import { format } from 'date-fns';

import MiniCalendar from './MiniCalendar';

const LocalizedMiniCalendar = (props) => {
    const weekdaysLong = useMemo(() => {
        return getFormattedWeekdays('cccc', { locale: dateLocale });
    }, [dateLocale]);

    const weekdaysShort = useMemo(() => {
        return getFormattedWeekdays('ccccc', { locale: dateLocale });
    }, [dateLocale]);

    const months = useMemo(() => {
        return getFormattedMonths('MMMM', { locale: dateLocale });
    }, [dateLocale]);

    return (
        <MiniCalendar
            nextMonth={c('Action').t`Next month`}
            prevMonth={c('Action').t`Prev month`}
            weekdaysLong={weekdaysLong}
            weekdaysShort={weekdaysShort}
            months={months}
            dateFnLocale={dateLocale}
            weekStartsOn={getWeekStartsOn(dateLocale)}
            formatDay={(date) => format(date, 'PPPP', { locale: dateLocale })}
            {...props}
        />
    );
};

export default LocalizedMiniCalendar;
