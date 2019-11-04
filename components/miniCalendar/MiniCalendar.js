import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { addMonths } from 'date-fns';

import { getDaysInMonth } from './helper';
import MonthDays from './MonthDays';
import WeekDays from './WeekDays';
import WeekNumbers from './WeekNumbers';
import Icon from '../icon/Icon';
import './miniCalendar.scss';

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
    displayWeekNumbers = true
}) => {
    const [temporaryDate, setTemporaryDate] = useState();

    const activeDate = temporaryDate || selectedDate;

    const days = useMemo(() => {
        return getDaysInMonth(activeDate, { weekStartsOn, weeks: numberOfWeeks - 1 });
    }, [activeDate, weekStartsOn, numberOfWeeks]);

    const monthLabel = useMemo(() => {
        return (
            <span className="pl0-5">
                {months[activeDate.getMonth()]} {activeDate.getFullYear()}
            </span>
        );
    }, [activeDate, months]);

    const handleSwitchMonth = (direction) => {
        setTemporaryDate(addMonths(activeDate, direction));
    };

    useEffect(() => {
        setTemporaryDate();
    }, [selectedDate]);

    const gridSize = '1fr';
    const style = displayWeekNumbers
        ? {
              display: 'grid',
              gridTemplateColumns: '30px auto',
              gridTemplateRows: 'auto'
          }
        : {};

    const preventLeaveFocus = (e) => e.preventDefault();

    return (
        <div className="minicalendar" onMouseDown={preventLeaveFocus} aria-label={monthLabel}>
            <div className="flex">
                <span className="bold flex-item-fluid">{monthLabel}</span>
                {hasCursors ? (
                    <>
                        <button type="button" className="mr1" onClick={() => handleSwitchMonth(-1)}>
                            <Icon name="caret" className="rotateZ-90" />
                            <span className="sr-only">{prevMonth}</span>
                        </button>
                        <button type="button" onClick={() => handleSwitchMonth(1)}>
                            <Icon name="caret" className="rotateZ-270" />
                            <span className="sr-only">{nextMonth}</span>
                        </button>
                    </>
                ) : null}
            </div>
            <div style={style}>
                {displayWeekNumbers ? (
                    <WeekNumbers gridSize={gridSize} numberOfWeeks={numberOfWeeks} days={days} />
                ) : null}
                <div>
                    <WeekDays
                        gridSize={gridSize}
                        numberOfDays={numberOfDays}
                        weekdaysShort={weekdaysShort}
                        weekdaysLong={weekdaysLong}
                        weekStartsOn={weekStartsOn}
                    />
                    <MonthDays
                        markers={markers}
                        gridSize={gridSize}
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
    displayWeekNumbers: PropTypes.bool
};

export default MiniCalendar;
