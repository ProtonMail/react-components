import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { getISOWeek } from 'date-fns';

const WeekNumbers = ({ days, numberOfWeeks, weekStartsOn }) => {
    const style = {
        '--minicalendar-weeknumbers-numberOfWeeks': numberOfWeeks + 1
    };

    const weekNumberLabels = useMemo(() => {
        return Array.from({ length: numberOfWeeks }, (a, i) => {
            // Have to calculate the iso week from monday.
            const mondayOffset = 1 - weekStartsOn;
            const day = days[i * 7 + (mondayOffset < 0 ? +mondayOffset + 7 : mondayOffset)];
            const weekNumber = getISOWeek(day);
            return (
                <span className="italic flex-item-fluid flex minicalendar-weeknumbers-number" key={+day}>
                    <span className="mauto">{weekNumber}</span>
                </span>
            );
        });
    }, [days]);

    return (
        <div className="aligncenter minicalendar-weeknumbers flex flex-column" style={style}>
            <span>
                <span className="minicalendar-weeknumbers-heading">{c('Info').t`Week`}</span>
            </span>
            {weekNumberLabels}
        </div>
    );
};

WeekNumbers.propTypes = {
    days: PropTypes.array.isRequired,
    numberOfWeeks: PropTypes.number.isRequired,
    weekStartsOn: PropTypes.number.isRequired
};

export default WeekNumbers;
