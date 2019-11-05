import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { addMonths } from 'date-fns';

import { getDaysInMonth } from './helper';
import { classnames } from '../../helpers/component';
import MonthDays from './MonthDays';
import WeekDays from './WeekDays';
import WeekNumbers from './WeekNumbers';
import Icon from '../icon/Icon';

const MiniCalendar = ({
    hasCursors = true,
    now = new Date(),
    date: selectedDate,
    dateRange,
    onSelectDate,
    onSelectDateRange,
    weekStartsOn = 1,
    weekdaysLong = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    weekdaysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    nextMonth = 'Next month',
    prevMonth = 'Prev month',
    formatDay,
    markers = {},
    months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],
    numberOfDays = 7,
    numberOfWeeks = 6,
    displayWeekNumbers = true,
    displayedOnDarkBackground = false
}) => {
    const [temporaryDate, setTemporaryDate] = useState();

    const activeDate = temporaryDate || selectedDate;

    const days = useMemo(() => {
        return getDaysInMonth(activeDate, { weekStartsOn, weeks: numberOfWeeks - 1 });
    }, [activeDate, weekStartsOn, numberOfWeeks]);

    const monthLabel = useMemo(() => {
        return `${months[activeDate.getMonth()]} ${activeDate.getFullYear()}`;
    }, [activeDate, months]);

    const handleSwitchMonth = (direction) => {
        setTemporaryDate(addMonths(activeDate, direction));
    };

    useEffect(() => {
        setTemporaryDate();
    }, [selectedDate]);

    const classWeekNumber = displayWeekNumbers ? 'mini-calendar-grid--displayWeekNumber' : '';
    const classDark = displayedOnDarkBackground ? 'minicalendar--onDarkBackground' : '';

    const preventLeaveFocus = (e) => e.preventDefault();

    return (
        <div
            className={classnames(['mini-calendar', classDark])}
            onMouseDown={preventLeaveFocus}
            aria-label={monthLabel}
        >
            <div className="flex">
                <span className="bold flex-item-fluid">{monthLabel}</span>
                {hasCursors ? (
                    <>
                        <button type="button" className="mr1" onClick={() => handleSwitchMonth(-1)}>
                            <Icon name="caret" size="12" className="rotateZ-90 fill-white" />
                            <span className="sr-only">{prevMonth}</span>
                        </button>
                        <button type="button" onClick={() => handleSwitchMonth(1)}>
                            <Icon name="caret" size="12" className="rotateZ-270 fill-white" />
                            <span className="sr-only">{nextMonth}</span>
                        </button>
                    </>
                ) : null}
            </div>
            <div className={classnames(['mini-calendar-grid', classWeekNumber])}>
                {displayWeekNumbers ? <WeekNumbers numberOfWeeks={numberOfWeeks} days={days} /> : null}
                <div>
                    <WeekDays
                        numberOfDays={numberOfDays}
                        weekdaysShort={weekdaysShort}
                        weekdaysLong={weekdaysLong}
                        weekStartsOn={weekStartsOn}
                    />
                    <MonthDays
                        markers={markers}
                        numberOfWeeks={numberOfWeeks}
                        numberOfDays={numberOfDays}
                        days={days}
                        formatDay={formatDay}
                        dateRange={dateRange}
                        onSelectDate={onSelectDate}
                        onSelectDateRange={onSelectDateRange}
                        now={now}
                        activeDate={activeDate}
                        selectedDate={selectedDate}
                    />
                </div>
            </div>
        </div>
    );
};

MiniCalendar.propTypes = {
    hasCursors: PropTypes.bool,
    markers: PropTypes.object,
    date: PropTypes.instanceOf(Date).isRequired,
    dateRange: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    dateFnLocale: PropTypes.object.isRequired,
    nextMonth: PropTypes.string.isRequired,
    prevMonth: PropTypes.string.isRequired,
    onSelectDate: PropTypes.func.isRequired,
    onSelectDateRange: PropTypes.func,
    formatDay: PropTypes.func,
    weekStartsOn: PropTypes.number,
    numberOfDays: PropTypes.number,
    numberOfWeeks: PropTypes.number,
    weekdaysShort: PropTypes.array,
    weekdaysLong: PropTypes.array,
    months: PropTypes.array,
    now: PropTypes.instanceOf(Date),
    displayWeekNumbers: PropTypes.bool,
    displayedOnDarkBackground: PropTypes.bool
};

export default MiniCalendar;
