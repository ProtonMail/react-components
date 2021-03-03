import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AsYouType, CountryCode, getCountryCallingCode, getExampleNumber } from 'libphonenumber-js/min';
import metadata from 'libphonenumber-js/metadata.min.json';
import examples from 'libphonenumber-js/examples.mobile.json';
import InputTwo, { InputTwoProps } from './Input';
import Icon from '../../icon/Icon';

const flags = require.context('design-system/assets/img/shared/flags/4x3', true, /.svg$/);
const flagsMap = flags.keys().reduce<Partial<{ [key: string]: () => { default: string } }>>((acc, key) => {
    acc[key] = () => flags(key);
    return acc;
}, {});

const getFlagSvg = (abbreviation: string) => {
    const key = `./${abbreviation.toLowerCase()}.svg`;
    if (!flagsMap[key]) {
        return;
    }
    return flagsMap[key]?.().default;
};

interface Props extends Omit<InputTwoProps, 'type' | 'value' | 'onChange'> {
    value: string;
    defaultCountry?: string;
    onChange: (value: string) => void;
}

const getSafeCountryCallingCode = (country: string) => {
    try {
        return getCountryCallingCode(country as CountryCode) as string;
    } catch (e) {
        return '';
    }
};

const getCountryFromCallingCode = (callingCode: string) => {
    const countries = metadata.country_calling_codes[callingCode];
    if (!countries || countries.length === 0) {
        return;
    }
    if (countries.length === 1) {
        return countries[0];
    }
    return countries[0];
};

const getNumberWithCountryCode = (value: string, countryCallingCode: string) => {
    if (value.includes('+')) {
        return value;
    }
    if (!countryCallingCode) {
        return value;
    }
    return `+${countryCallingCode}${value}`;
};

const getNumberWithoutCountryCode = (value: string, countryCallingCode: string) => {
    return value.replace(`+${countryCallingCode}`, '');
};

const getCountryFromNumber = (value: string) => {
    const asYouType = new AsYouType();
    asYouType.input(value);
    const result = asYouType.getNumber();
    if (result) {
        return result.country || getCountryFromCallingCode(result.countryCallingCode as string) || '';
    }
    // @ts-ignore Types are wrong
    const country = asYouType.getCountry?.() as CountryCode;
    if (country) {
        return country;
    }
    if (!value.length) {
        return '';
    }
    if (value[0] === '+') {
        const callingCode = value.slice(1);
        const country = getCountryFromCallingCode(callingCode);
        return country || '';
    }
    return '';
};

export const getTemplateFromNumber = (value: string, defaultCountry?: string): string => {
    const asYouType = new AsYouType(defaultCountry as CountryCode);
    asYouType.input(value);
    return asYouType.getTemplate() || '';
};

const getTemplateValue = (string: string, template: string) => {
    const result = template.split('');
    let j = 0;
    for (let i = 0; i < template.length && string.length > j; ++i) {
        if (result[i] === 'x') {
            result[i] = string[j++];
        }
    }
    return result.join('') + string.slice(j);
};

const getTrimmedString = (string: string) => {
    // Handle (123) -> (123
    const slicedValue = string.match(/\([\d]+$/) ? string.slice(0, -1) : string;
    // Remove everything except numbers and +
    const trimmedString = slicedValue.replace(/[^0-9+]+/g, '');
    if (!trimmedString.length) {
        return '';
    }
    // Remove all + in case there are multiple
    return trimmedString[0] + trimmedString.slice(1).replace(/\+/g, '');
};

const getExamplePlaceholder = (country: string) => {
    const example = getExampleNumber(country as CountryCode, examples);
    if (!example?.nationalNumber) {
        return '';
    }
    return example.formatNational();
};

const getCountryToUse = (newCountry: string, oldCountry: string) => {
    if (!newCountry) {
        return oldCountry;
    }
    if (!oldCountry) {
        return newCountry;
    }
    const newCountryCallingCode = getSafeCountryCallingCode(newCountry as CountryCode);
    const oldCountryCallingCode = getSafeCountryCallingCode(oldCountry as CountryCode);
    if (newCountryCallingCode === oldCountryCallingCode) {
        const countries = metadata.country_calling_codes[newCountryCallingCode];
        if (!countries?.length) {
            return oldCountry;
        }
        // New country is more specific in the list? Use the new country
        if (countries.indexOf(newCountry) > countries.indexOf(oldCountry)) {
            return newCountry;
        }
        return oldCountry;
    }
    return newCountry;
};

const usePreviousValue = <T,>(value: T) => {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};

const PhoneInput = ({ value: actualValue = '', defaultCountry = 'US', onChange, onValue, ...rest }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [isCountryCallingCodeMode, setIsCountryCallingCodeMode] = useState(false);
    const [oldCountry, setOldCountry] = useState(defaultCountry);

    const trimmedValue = getTrimmedString(actualValue);
    const previousTrimmedValue = usePreviousValue(trimmedValue);

    const oldCountryCallingCode = getSafeCountryCallingCode(oldCountry);
    const countryFromValue = getCountryFromNumber(getNumberWithCountryCode(trimmedValue, oldCountryCallingCode));

    const country =
        previousTrimmedValue === '' && trimmedValue === '+'
            ? ''
            : previousTrimmedValue === '+' && trimmedValue === '' && oldCountry === ''
            ? defaultCountry
            : getCountryToUse(countryFromValue, oldCountry);

    const countryCallingCode = getSafeCountryCallingCode(country);

    const normalizedValue = isCountryCallingCodeMode
        ? getNumberWithCountryCode(trimmedValue, countryCallingCode)
        : getNumberWithoutCountryCode(trimmedValue, countryCallingCode);

    const templateString = getTemplateFromNumber(normalizedValue, country);
    const templatedValue = getTemplateValue(normalizedValue, templateString);
    const placeholder = getExamplePlaceholder(country);

    const flagSvg = getFlagSvg(country as string);
    const countryFlag = flagSvg ? <img src={flagSvg} width={50} /> : <Icon name="globe" />;

    useLayoutEffect(() => {
        if (trimmedValue === '+') {
            setOldCountry('');
            return;
        }
        setOldCountry(country);
    }, [country]);

    /*
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

    return (
        <InputTwo
            {...rest}
            value={templatedValue}
            ref={inputRef}
            placeholder={placeholder}
            suffix={
                <div>
                    {countryFlag}
                    {oldCountry}
                </div>
            }
            onChange={({ target, target: { value: newStringValue } }) => {
                const newTrimmedValue = getTrimmedString(newStringValue);
                setIsCountryCallingCodeMode(newTrimmedValue[0] === '+');
                const newValue = !newTrimmedValue.length
                    ? ''
                    : getNumberWithCountryCode(newTrimmedValue, countryCallingCode);
                onChange(newValue);
                /*
                const result = getState(newStringValue, actualValue, country, defaultCountry);

                const trimmedString = getTrimmedString(newStringValue.slice(0, target.selectionEnd || newStringValue.length));
                const firstNumberPosition = trimmedString.length;
                console.log({ trimmedString, firstNumberPosition });
                selectionStartRef.current = firstNumberPosition;
                oldValue.current = newStringValue;

                setCountry(result);
                console.log(result);
                onChange?.(result.normalizedValue);
                onValue?.(result.normalizedValue);
                 */
            }}
        />
    );
};

export default PhoneInput;
