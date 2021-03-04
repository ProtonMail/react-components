import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import parsePhoneNumberFromString, { formatIncompletePhoneNumber } from 'libphonenumber-js/max';

import data from './data';
import InputTwo, { InputTwoProps } from '../input/Input';
import {
    getCountries,
    getCountryFromNumber,
    getExamplePlaceholder,
    getNumberWithCountryCode,
    getNumberWithoutCountryCode,
    getSafeCountryCallingCode,
    getTrimmedString,
} from './helper';
import CountrySelect from './CountrySelect';

const usePreviousValue = <T,>(value: T) => {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};

interface Props extends Omit<InputTwoProps, 'type' | 'value' | 'onChange'> {
    value: string;
    defaultCountry?: string;
    onChange: (value: string) => void;
}

const getFormattedValue = (number: string) => {
    const result = parsePhoneNumberFromString(number);
    if (result && result.isValid()) {
        return result.formatInternational();
    }
    return formatIncompletePhoneNumber(number);
};

const getSpecificCountry = (value: string, countryCallingCode: string, countryCode: string) => {
    const leadings = data[countryCallingCode];
    if (!leadings) {
        return countryCode;
    }
    let len = 0;
    return leadings.reduce((acc, { countryCode, areaCodes }) => {
        const result = areaCodes.find((areaCode) => value.startsWith(areaCode));
        if (result && result.length >= len) {
            len = result.length;
            return countryCode;
        }
        return acc;
    }, countryCode);
};

const PhoneInput = ({ value: actualValue = '', defaultCountry = 'US', onChange, onValue, ...rest }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isCountryCallingCodeMode, setIsCountryCallingCodeMode] = useState(false);
    const [oldCountry, setOldCountry] = useState(defaultCountry);

    const trimmedValue = getTrimmedString(actualValue);
    const previousTrimmedValue = usePreviousValue(trimmedValue);

    const oldCountryCallingCode = getSafeCountryCallingCode(oldCountry);
    const valueWithCountryCallingCode = getNumberWithCountryCode(trimmedValue, oldCountryCallingCode);

    const valueCountryCode = getCountryFromNumber(valueWithCountryCallingCode);
    const valueCountryCallingCode = getSafeCountryCallingCode(valueCountryCode);
    const valueWithoutCountryCallingCode = getNumberWithoutCountryCode(
        valueWithCountryCallingCode,
        valueCountryCallingCode
    );
    const valueCountryCodeSpecific = getSpecificCountry(
        valueWithoutCountryCallingCode,
        valueCountryCallingCode,
        oldCountryCallingCode === valueCountryCallingCode ? oldCountry : valueCountryCode
    );

    const placeholder = getNumberWithoutCountryCode(
        getExamplePlaceholder(valueCountryCodeSpecific),
        valueCountryCallingCode
    );
    const countryCallingCode = valueCountryCallingCode;

    // 1. Going from '' -> '+' === remove country
    // 2. Removed country and going from '+' -> '' === add back default country
    // 3. Guess country from number
    const countryCode =
        previousTrimmedValue === '' && trimmedValue === '+'
            ? ''
            : previousTrimmedValue === '+' && trimmedValue === '' && oldCountry === ''
            ? defaultCountry
            : valueCountryCodeSpecific || oldCountry;

    const formattedValue = getFormattedValue(valueWithCountryCallingCode).trim();

    const normalizedValue = isCountryCallingCodeMode
        ? formattedValue
        : getNumberWithoutCountryCode(formattedValue, countryCallingCode);

    useLayoutEffect(() => {
        if (trimmedValue === '+') {
            setOldCountry('');
            return;
        }
        setOldCountry(countryCode);
    }, [countryCode]);

    /*
    useLayoutEffect(() => {
        if (trimmedValue === '+') {
            setOldCountry('');
            return;
        }
        setOldCountry(countryCode);
    }, [countryCode]);

    const selectionStartRef = useRef<number | null>(null);
    const oldValue = useRef<string | null>(null);

    const [{ country, template, hasCountryCallingCode }, setCountry] = useState(() => {
        return {
            ...getState(actualValue, actualValue, defaultCountry, defaultCountry),
            hasCountryCallingCode: false,
        };
    });


    const number = hasCountryCallingCode ? undefined : getNumber(actualValue, country);
    const normalizedValue = number ? actualValue.replace(`+${number.countryCallingCode}`, '') : actualValue;
    const templatedValue = getTemplateValue(normalizedValue, template);


    useLayoutEffect(() => {
        const inputEl = inputRef.current;
        if (selectionStartRef.current !== null && inputEl && (inputEl.selectionEnd === inputEl.value.length)) {
            const newStart = selectionStartRef.current;
            let n = 0;
            let i = 0;
            for (; i < templatedValue.length; ++i) {
                console.log(templatedValue[i])
                console.log({ n, i, newStart })
                if (templatedValue[i].match(/[\d+]/)) {
                    if (++n >= newStart) {
                        break;
                    }
                }
            }
            console.log({ n, i, newStart })
            inputEl.selectionStart = i;
            inputEl.selectionEnd = i;
        }
        selectionStartRef.current = null;
    }, [templatedValue]);
    */

    const countries = useMemo(() => getCountries(), []);
    const selectedValue = countries.find((data) => data.countryCode === countryCode);

    return (
        <InputTwo
            {...rest}
            value={normalizedValue}
            ref={inputRef}
            placeholder={placeholder}
            prefix={
                <CountrySelect
                    value={selectedValue}
                    options={countries}
                    onChange={(newSelectedValue) => {
                        setIsCountryCallingCodeMode(false);
                        setOldCountry(newSelectedValue.countryCode);
                        onChange('');
                    }}
                />
            }
            onChange={({ target: { value: newStringValue } }) => {
                const newTrimmedValue = getTrimmedString(newStringValue);
                setIsCountryCallingCodeMode(newTrimmedValue[0] === '+');
                const newValue = !newTrimmedValue.length
                    ? ''
                    : getNumberWithCountryCode(newTrimmedValue, countryCallingCode);
                onChange(newValue);
            }}
        />
    );
};

export default PhoneInput;
