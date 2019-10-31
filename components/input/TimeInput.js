import React, { useEffect, useState, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { findLongestMatchingIndex } from 'proton-shared/lib/helpers/string';
import { formatTime } from 'proton-shared/lib/date/time';

import Input from './Input';
import Dropdown from '../dropdown/Dropdown';
import { usePopperAnchor } from '../popper';
import { classnames, generateUID } from '../../helpers/component';

const fromObject = ({ hours, minutes }) => hours * 60 + minutes;
const toObject = (value) => {
    const minutes = value % 60;
    return {
        hours: (value - minutes) / 60,
        minutes
    };
};

const toFormatted = (value, isAmPm) => {
    const { hours, minutes } = toObject(value);
    return formatTime(hours, minutes, isAmPm);
};

const fromFormatted = (value, isAmPm) => {
    return parseTime(value, isAmPm);
};

const TimeInput = ({ onChange, value, interval = 30, displayAmPm = false, ...rest }) => {
    const [uid] = useState(generateUID('dropdown'));
    const { anchorRef, isOpen, open, close } = usePopperAnchor();
    const [temporaryInput, setTemporaryInput] = useState(() => formatTime(value.hours, value.minutes, displayAmPm));

    useEffect(() => {
        setTemporaryInput(formatTime(value.hours, value.minutes, displayAmPm));
    }, [value]);

    const parseAndSetDate = () => {
        try {
            /*
            const newDate = fromFormatted(temporaryInput, isAmPm);
            const newDateTime = +newDate;
            if (!isNaN(newDateTime)) {
                onChange(newDate);
            }
            // eslint-disable-next-line no-empty
             */
        } catch (e) {}

        console.log(value);
        setTemporaryInput(formatTime(value.hours, value.minutes, displayAmPm));
    };

    const handleBlur = () => {
        parseAndSetDate(temporaryInput);
        close();
    };

    const handleKeyDown = (event) => {
        const { key } = event;
        if (key === 'Enter') {
            parseAndSetDate(temporaryInput);
            event.preventDefault();
            return close();
        }

        if (key === 'ArrowDown') {
            onChange(toObject(fromObject(value) + interval));
        }

        if (key === 'ArrowUp') {
            onChange(toObject(fromObject(value) - interval));
        }
    };

    const scrollRef = useRef();
    const listRef = useRef();
    const options = useMemo(() => {
        const multiplier = (24 * 60) / interval;
        const base = 0;
        return Array.from({ length: multiplier }, (a, i) => {
            const value = toObject(base + i * interval);
            return {
                value,
                label: formatTime(value.hours, value.minutes, displayAmPm)
            };
        });
    }, [displayAmPm]);

    const matchingIndex = useMemo(() => {
        const idx = findLongestMatchingIndex(options.map(({ label }) => label), temporaryInput);
        return idx === -1 ? undefined : idx;
    }, [options, temporaryInput]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const matchingEl = listRef.current.children[matchingIndex];
        if (matchingEl) {
            scrollRef.current.scrollTop =
                matchingEl.offsetTop - (scrollRef.current.clientHeight - matchingEl.clientHeight) / 2;
        }
    }, [matchingIndex, isOpen]);

    return (
        <>
            <Input
                type="text"
                ref={anchorRef}
                onFocus={() => open()}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onClick={() => open()}
                value={temporaryInput}
                onChange={({ target: { value } }) => setTemporaryInput(value)}
                {...rest}
            />
            <Dropdown size="narrow" id={uid} isOpen={isOpen} anchorRef={anchorRef} onClose={close} autoClose={false}>
                <div className="dropDown-content" onMouseDown={(e) => e.preventDefault()} ref={scrollRef}>
                    <ul className="unstyled mt0 mb0" ref={listRef}>
                        {options.map(({ label, value: otherValue }, i) => {
                            const isSelected = label === temporaryInput;
                            return (
                                <li className={classnames(['pt0-5 pb0-5 p1', isSelected && 'bold'])} key={i}>
                                    <button
                                        onClick={() => {
                                            onChange(otherValue);
                                            close();
                                        }}
                                    >
                                        {label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </Dropdown>
        </>
    );
};

TimeInput.propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    interval: PropTypes.number,
    displayAmPm: PropTypes.boolean
};

export default TimeInput;
