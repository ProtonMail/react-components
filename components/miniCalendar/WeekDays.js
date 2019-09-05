import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../tooltip/Tooltip';

const WeekDays = ({ weekdaysShort, weekdaysLong, weekStartsOn, gridSize, numberOfDays }) => {
    const style = {
        display: 'grid',
        gridTemplateColumns: `repeat(${numberOfDays}, ${gridSize})`,
        gridTemplateRows: gridSize,
        opacity: '0.3',
        textAlign: 'center'
    };

    const weekDaysLabels = useMemo(() => {
        return weekdaysShort.map((el, i) => {
            const idx = (i + weekStartsOn) % 7;
            const label = weekdaysShort[idx];
            const tooltip = weekdaysLong[idx];
            return (
                <Tooltip key={label + i} title={tooltip}>
                    <span>{label}</span>
                </Tooltip>
            );
        });
    }, [weekdaysShort, weekStartsOn]);

    return <div style={style}>{weekDaysLabels}</div>;
};

WeekDays.propTypes = {
    gridSize: PropTypes.string,
    numberOfDays: PropTypes.number.isRequired,
    weekStartsOn: PropTypes.number.isRequired,
    weekdaysShort: PropTypes.array.isRequired,
    weekdaysLong: PropTypes.array.isRequired
};

export default WeekDays;
