import React, { useState, useEffect, useMemo, useRef } from 'react';
import { format, parse, addDays } from 'date-fns';
import { dateLocale } from 'proton-shared/lib/i18n';

import Input from './Input';
import { usePopperAnchor } from '../popper';
import Dropdown from '../dropdown/Dropdown';
import { generateUID } from '../../helpers/component';
import LocalizedMiniCalendar from '../miniCalendar/LocalizedMiniCalendar';

const toFormatted = (value: Date, locale: Locale) => {
    return format(value, 'PP', { locale });
};

const fromFormatted = (value: string, locale: Locale) => {
    return parse(value, 'PP', new Date(), { locale });
};

const getTemporaryInputFromValue = (value: Date | undefined) => {
    return value ? toFormatted(value, dateLocale) : '';
};

interface Props {
    id?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    displayWeekNumbers?: boolean;
    weekStartsOn?: number;
    value?: Date;
    defaultDate?: Date;
    min?: Date;
    max?: Date;
    onChange: (value: Date | undefined) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}
const DateInput = ({
    value,
    defaultDate,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    displayWeekNumbers,
    weekStartsOn,
    min,
    max,
    ...rest
}: Props) => {
    const [uid] = useState(generateUID('dropdown'));
    const anchorRef = useRef<HTMLInputElement>();
    const { isOpen, open, close } = usePopperAnchor();

    const [temporaryInput, setTemporaryInput] = useState<string>('');
    const [showTemporary, setShowTemporary] = useState<boolean>(false);

    useEffect(() => {
        setTemporaryInput(getTemporaryInputFromValue(value));
    }, [value ? +value : undefined]);

    const currentInput = useMemo(() => {
        return value ? toFormatted(value, dateLocale) : '';
    }, [value ? +value : undefined]);

    const temporaryValue = useMemo(() => {
        if (!temporaryInput) {
            return;
        }
        try {
            const newDate = fromFormatted(temporaryInput, dateLocale);
            if (newDate.getFullYear() < 1900 || newDate.getFullYear() > 2200) {
                return;
            }
            if (isNaN(+newDate)) {
                return;
            }
            return newDate;
            // eslint-disable-next-line no-empty
        } catch (e) {}
    }, [temporaryInput]);

    const actualDefaultDate = useMemo(() => defaultDate || new Date(), [defaultDate]);
    const actualValue = temporaryValue || value || actualDefaultDate;

    const parseAndTriggerChange = () => {
        const oldTemporaryInput = temporaryInput;
        // Before the new date is set, the input is reset to the old date in case the onChange handler rejects the change,
        // or it's an invalid date that couldn't be parsed
        setTemporaryInput(getTemporaryInputFromValue(value));
        // Allow a valid parsed date value, or undefined to reset.
        if (temporaryValue || !oldTemporaryInput) {
            onChange(temporaryValue);
        }
    };

    const handleFocusInput = (event: React.FocusEvent<HTMLInputElement>) => {
        onFocus && onFocus(event);
        open();

        setShowTemporary(true);
        setTemporaryInput(currentInput);
    };

    const handleBlurInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        onBlur && onBlur(event);
        parseAndTriggerChange();
        close();

        setShowTemporary(false);
        setTemporaryInput('');
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown && onKeyDown(event);
        if (event.key === 'Enter') {
            parseAndTriggerChange();
            event.preventDefault();
        }
        if (event.key === 'ArrowDown') {
            setTemporaryInput(toFormatted(addDays(actualValue, -1), dateLocale));
        }
        if (event.key === 'ArrowUp') {
            setTemporaryInput(toFormatted(addDays(actualValue, 1), dateLocale));
        }
    };

    const handleClickDate = (newDate: Date) => {
        setTemporaryInput(toFormatted(newDate, dateLocale));
        setTimeout(() => anchorRef.current?.blur());
    };

    const handleInputChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        setTemporaryInput(value);
    };

    const placeholderInLocale = useMemo(() => {
        return dateLocale?.formatLong?.date({ width: 'medium' }) || '';
    }, [dateLocale]);

    return (
        <>
            <Input
                type="text"
                ref={anchorRef}
                onFocus={handleFocusInput}
                onBlur={handleBlurInput}
                onKeyDown={handleKeyDown}
                value={showTemporary ? temporaryInput : currentInput}
                onChange={handleInputChange}
                placeholder={placeholderInLocale}
                {...rest}
            />
            <Dropdown id={uid} isOpen={isOpen} anchorRef={anchorRef} onClose={close} autoClose={false}>
                <LocalizedMiniCalendar
                    date={actualValue}
                    min={min}
                    max={max}
                    onSelectDate={handleClickDate}
                    displayWeekNumbers={displayWeekNumbers}
                    weekStartsOn={weekStartsOn}
                />
            </Dropdown>
        </>
    );
};

export default DateInput;
