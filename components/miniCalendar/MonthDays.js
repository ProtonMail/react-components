import { isAfter, isSameDay, isSameMonth, isWithinInterval } from 'date-fns';
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { classnames } from '../../helpers/component';

const getRangeClass = (range, dayDate) => {
    if (!range) {
        return;
    }

    const [rangeStart, rangeEnd] = range;
    if (!rangeStart || !rangeEnd) {
        return;
    }

    if (isSameDay(rangeStart, dayDate) || isSameDay(rangeEnd, dayDate)) {
        return 'minicalendar-day--range-bound';
    }

    if (isWithinInterval(dayDate, { start: rangeStart, end: rangeEnd })) {
        return 'minicalendar-day--range';
    }
};

const MonthDays = ({
    days,
    onSelectDate,
    onSelectDateRange,
    dateRange,
    formatDay,
    now,
    selectedDate,
    activeDate,
    numberOfDays,
    numberOfWeeks,
    gridSize
}) => {
    const [temporaryDateRange, setTemporaryDateRange] = useState();
    const rangeStartRef = useRef();
    const rangeEndRef = useRef();

    const style = {
        display: 'grid',
        gridTemplateColumns: `repeat(${numberOfDays}, ${gridSize})`,
        gridTemplateRows: `repeat(${numberOfWeeks}, ${gridSize})`
    };

    const getDate = (el) => {
        return days[el.dataset.i];
    };

    const handleMouseDown = ({ target }) => {
        if (typeof target.dataset.i === 'undefined') {
            return;
        }

        if (rangeStartRef.current) {
            return;
        }

        const targetDate = getDate(target);

        setTemporaryDateRange([targetDate, undefined]);
        rangeStartRef.current = targetDate;

        const handleMouseUp = () => {
            if (rangeEndRef.current && rangeStartRef.current) {
                onSelectDateRange(
                    isAfter(rangeEndRef.current, rangeStartRef.current)
                        ? [rangeStartRef.current, rangeEndRef.current]
                        : [rangeEndRef.current, rangeStartRef.current]
                );
            }

            setTemporaryDateRange();
            rangeStartRef.current = undefined;
            rangeEndRef.current = undefined;

            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseOver = ({ target }) => {
        if (typeof target.dataset.i === 'undefined') {
            return;
        }

        if (!rangeStartRef.current) {
            return;
        }

        const overDate = getDate(target);
        rangeEndRef.current = overDate;

        setTemporaryDateRange(
            isAfter(overDate, rangeStartRef.current)
                ? [rangeStartRef.current, overDate]
                : [overDate, rangeStartRef.current]
        );
    };

    const handleClick = ({ target }) => {
        if (typeof target.dataset.i === 'undefined') {
            return;
        }
        onSelectDate(getDate(target));
    };

    return (
        <div
            className="aligncenter minicalendar-days"
            style={style}
            onClick={handleClick}
            onMouseDown={onSelectDateRange ? handleMouseDown : null}
            onMouseOver={onSelectDateRange ? handleMouseOver : null}
        >
            {days.map((dayDate, i) => {
                const isActiveMonth = isSameMonth(dayDate, activeDate);
                const isCurrent = isSameDay(now, dayDate);
                const isSelected = isSameDay(selectedDate, dayDate);

                const className = classnames([
                    'minicalendar-day',
                    !isActiveMonth && 'minicalendar-day--inactive-month',
                    getRangeClass(temporaryDateRange || dateRange || undefined, dayDate)
                ]);

                return (
                    <button
                        aria-label={formatDay(dayDate)}
                        aria-current={isCurrent}
                        aria-selected={isSelected}
                        key={dayDate.toString()}
                        className={className}
                        data-i={i}
                    >
                        {dayDate.getDate()}
                    </button>
                );
            })}
        </div>
    );
};

MonthDays.propTypes = {
    days: PropTypes.array.isRequired,
    dateRange: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    formatDay: PropTypes.func.isRequired,
    onSelectDate: PropTypes.func.isRequired,
    onSelectDateRange: PropTypes.func,
    numberOfDays: PropTypes.number.isRequired,
    numberOfWeeks: PropTypes.number.isRequired,
    gridSize: PropTypes.string,
    now: PropTypes.instanceOf(Date),
    selectedDate: PropTypes.instanceOf(Date),
    activeDate: PropTypes.instanceOf(Date)
};

export default MonthDays;
