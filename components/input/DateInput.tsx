import React, { useState, useEffect, useMemo } from 'react';
import { format, parse, addDays, Locale } from 'date-fns';
import { dateLocale } from 'proton-shared/lib/i18n';
import { c } from 'ttag';

import Input, { Props as InputProps } from './Input';
import { usePopperAnchor } from '../popper';
import Dropdown from '../dropdown/Dropdown';
import { generateUID } from '../../helpers';
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

const DEFAULT_MIN = new Date(1900, 0, 1);
const DEFAULT_MAX = new Date(2200, 0, 1);

interface Props extends Omit<InputProps, 'min' | 'max' | 'value' | 'onChange'> {
    displayWeekNumbers?: boolean;
    weekStartsOn?: 0 | 2 | 1 | 6 | 5 | 4 | 3;
    value?: Date;
    placeholder?: string;
    defaultDate?: Date;
    min?: Date;
    max?: Date;
    onChange: (value: Date | undefined) => void;
}
const DateInput = ({
    value,
    defaultDate,
    placeholder,
    autoFocus,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    displayWeekNumbers,
    weekStartsOn,
    min = DEFAULT_MIN,
    max = DEFAULT_MAX,
    ...rest
}: Props) => {
    const [uid] = useState(generateUID('dropdown'));
    const { anchorRef, isOpen, open, close } = usePopperAnchor<HTMLInputElement>();

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
            if (newDate < min || newDate > max) {
                return;
            }
            if (Number.isNaN(+newDate)) {
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
        onFocus?.(event);
        open();

        setShowTemporary(true);
        setTemporaryInput(currentInput);
    };

    const handleBlurInput = (event: React.FocusEvent<HTMLInputElement>) => {
        onBlur?.(event);
        parseAndTriggerChange();
        close();

        setShowTemporary(false);
        setTemporaryInput('');
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event);
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
        return toFormatted(actualDefaultDate, dateLocale);
    }, [dateLocale, defaultDate]);

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
                placeholder={
                    placeholder !== undefined ? placeholder : `${c('Placeholder').t`E.g., `}${placeholderInLocale}`
                }
                autoFocus={autoFocus}
                {...rest}
            />
            <Dropdown
                disableFocusTrap
                autoClose={false}
                autoCloseOutside={false}
                id={uid}
                isOpen={isOpen}
                anchorRef={anchorRef}
                onClose={close}
            >
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
