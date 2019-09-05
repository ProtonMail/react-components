import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { addHours, addMinutes, startOfDay, format, parse } from 'date-fns';
import { dateLocale } from 'proton-shared/lib/i18n';

import { classnames } from '../../helpers/component';
import Input from './Input';
import Dropdown from '../dropdown/Dropdown';
import { usePopperAnchor } from '../popper';
import { generateUID } from '../../helpers/component';

const toFormatted = (value, locale) => {
    return format(value, 'p', { locale });
};

const fromFormatted = (value, locale) => {
    return parse(value, 'p', new Date(), { locale });
};

const TimeSelect = ({ value, onSelect, interval, locale }) => {
    const options = useMemo(() => {
        const multiplier = 1440 / 30;
        const base = startOfDay(value);
        return Array.from({ length: multiplier }, (a, i) => {
            return addMinutes(base, i * interval);
        });
    }, []);

    const handleClick = ({ target }) => {
        const id = parseInt(target.dataset.id, 10);
        if (isNaN(id) || !options[id]) {
            return;
        }
        return onSelect(options[id]);
    };

    return (
        <ul className="unstyled mt0 mb0" onClick={handleClick}>
            {options.map((option, i) => {
                const isSelected = value.getHours() === option.getHours() && value.getMinutes() === option.getMinutes();
                return (
                    <li className={classnames(['pt0-5 pb0-5 p1', isSelected && 'bold'])} key={i} data-id={i}>
                        {format(option, 'p', { locale })}
                    </li>
                );
            })}
        </ul>
    );
};

TimeSelect.propTypes = {
    value: PropTypes.instanceOf(Date).isRequired,
    onSelect: PropTypes.func.isRequired,
    interval: PropTypes.number,
    locale: PropTypes.object
};

const TimeInput = ({ onChange, value, interval = 30, ...rest }) => {
    const [uid] = useState(generateUID('dropdown'));
    const { anchorRef, isOpen, open, close } = usePopperAnchor();
    const [temporaryInput, setTemporaryInput] = useState(() => toFormatted(value, dateLocale));

    useEffect(() => {
        setTemporaryInput(toFormatted(value, dateLocale));
    }, [value]);

    const handleSelectDate = (newDate) => {
        onChange(newDate);
    };

    const parseAndSetDate = () => {
        try {
            const newDate = fromFormatted(temporaryInput, dateLocale);
            const newDateTime = +newDate;
            if (!isNaN(newDateTime)) {
                handleSelectDate(newDate);
            }
            // eslint-disable-next-line no-empty
        } catch (e) {}

        setTemporaryInput(toFormatted(value, dateLocale));
    };

    const handleFocus = () => {
        open();
    };

    const handleBlur = () => {
        parseAndSetDate(temporaryInput);
        close();
    };

    const handleKeyDown = ({ key }) => {
        if (key === 'Enter') {
            parseAndSetDate(temporaryInput);
        }
        if (key === 'ArrowDown') {
            handleSelectDate(addHours(value, -1));
        }
        if (key === 'ArrowUp') {
            handleSelectDate(addHours(value, 1));
        }
    };

    return (
        <>
            <Input
                type="text"
                ref={anchorRef}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                value={temporaryInput}
                onChange={({ target: { value } }) => setTemporaryInput(value)}
                {...rest}
            />
            <Dropdown size="narrow" id={uid} isOpen={isOpen} anchorRef={anchorRef} onClose={close} autoClose={false}>
                <div className="dropDown-content" onMouseDown={(e) => e.preventDefault()}>
                    <TimeSelect interval={interval} locale={dateLocale} value={value} onSelect={handleSelectDate} />
                </div>
            </Dropdown>
        </>
    );
};

TimeInput.propTypes = {
    value: PropTypes.instanceOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
    interval: PropTypes.number
};

export default TimeInput;
