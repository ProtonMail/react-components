import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MiniCalendar } from 'react-components';
import { format, parse, addDays } from 'date-fns';
import { getWeekStartsOn, getFormattedWeekdays, getFormattedMonths } from 'proton-shared/lib/date/date';
import { dateLocale } from 'proton-shared/lib/i18n';

import Input from './Input';
import { usePopperAnchor } from '../popper';
import Dropdown from '../dropdown/Dropdown';
import { generateUID } from '../../helpers/component';

const toFormatted = (value, locale) => {
    return format(value, 'P', { locale });
};

const fromFormatted = (value, locale) => {
    return parse(value, 'P', new Date(), { locale });
};

const DateInput = ({ value, min, max, onChange, ...rest }) => {
    const [uid] = useState(generateUID('dropdown'));
    const { anchorRef, isOpen, open, close } = usePopperAnchor();
    const [temporaryInput, setTemporaryInput] = useState(() => toFormatted(value, dateLocale));

    useEffect(() => {
        setTemporaryInput(toFormatted(value, dateLocale));
    }, [value.getTime()]);

    const handleSelectDate = (newDate) => {
        const newDateTime = +newDate;
        if ((min && +min > newDateTime) || (max && +max < newDateTime)) {
            setTemporaryInput(toFormatted(value, dateLocale));
            return;
        }
        onChange(newDate);
    };

    const parseAndSetDate = () => {
        try {
            const newDate = fromFormatted(temporaryInput, dateLocale);
            const newDateTime = +newDate;
            if (!isNaN(newDateTime)) {
                return handleSelectDate(newDate);
            }
            // eslint-disable-next-line no-empty
        } catch (e) {}

        setTemporaryInput(toFormatted(value, dateLocale));
    };

    const handleBlur = () => {
        parseAndSetDate();
        close();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            parseAndSetDate();
            event.preventDefault();
        }
        if (event.key === 'ArrowDown') {
            handleSelectDate(addDays(value, -1));
        }
        if (event.key === 'ArrowUp') {
            handleSelectDate(addDays(value, 1));
        }
    };

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
        <>
            <Input
                type="text"
                ref={anchorRef}
                onFocus={open}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                value={temporaryInput}
                onChange={({ target: { value } }) => setTemporaryInput(value)}
                {...rest}
            />
            <Dropdown id={uid} isOpen={isOpen} anchorRef={anchorRef} onClose={close} autoClose={false}>
                <MiniCalendar
                    weekdaysShort={weekdaysShort}
                    weekdaysLong={weekdaysLong}
                    months={months}
                    weekStartsOn={getWeekStartsOn(dateLocale)}
                    date={value}
                    onSelectDate={handleSelectDate}
                    hasWeekNumbers={false}
                />
            </Dropdown>
        </>
    );
};

DateInput.propTypes = {
    id: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    className: PropTypes.string,
    value: PropTypes.instanceOf(Date).isRequired,
    min: PropTypes.instanceOf(Date),
    max: PropTypes.instanceOf(Date),
    onChange: PropTypes.func.isRequired
};

export default DateInput;
