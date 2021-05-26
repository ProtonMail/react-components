import React, { useMemo } from 'react';
import { WeekStartsOn } from './index.d';

import Tooltip from '../tooltip/Tooltip';
import { classnames } from '../../helpers';

export interface Props {
    weekStartsOn: WeekStartsOn;
    numberOfDays?: number;
    weekdaysLong: string[];
    weekdaysShort: string[];
    now?: Date;
}

const WeekDays = ({ weekdaysShort, weekdaysLong, weekStartsOn = 1, numberOfDays, now }: Props) => {
    const style = {
        '--minicalendar-weekdays-numberOfDaysInWeek': numberOfDays,
    };
    const currentDayInWeek = now && now.getDay();

    const weekDaysLabels = useMemo(() => {
        return weekdaysShort.map((el, i) => {
            const idx = (i + weekStartsOn) % 7;
            const label = weekdaysShort[idx];
            const tooltip = weekdaysLong[idx];
            const isCurrentDay = idx === currentDayInWeek;
            return (
                <Tooltip key={label + i} title={tooltip}>
                    <span aria-hidden="true" className={classnames(['text-strong', isCurrentDay && 'color-primary'])}>
                        {label}
                        <span className="sr-only">{tooltip}</span>
                    </span>
                </Tooltip>
            );
        });
    }, [weekdaysShort, weekStartsOn, now]);

    return (
        <div className="text-center minicalendar-weekdays" style={style}>
            {weekDaysLabels}
        </div>
    );
};

export default WeekDays;
