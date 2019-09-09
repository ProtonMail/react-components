import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'proton-shared/lib/helpers/function';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import Input from './Input';
import SimpleDropdown from '../dropdown/SimpleDropdown';
import DropdownMenu from '../dropdown/DropdownMenu';
import DropdownMenuButton from '../dropdown/DropdownMenuButton';
import { classnames } from '../../helpers/component';
import { countriesData, findIndexCountry } from '../../helpers/tel';

import './IntlTelInput.scss';

// require.context would be replaced by a dummy function in tests
const flags = require.context('design-system/assets/img/shared/flags/4x3', true, /.svg$/);

const getFlagSvg = (abbreviation) => {
    try {
        return flags(`./${abbreviation.toLowerCase()}.svg`);
    } catch (e) {
        return undefined;
    }
};

const DEFAULT_COUNTRY = 'us';

const IntlTelInput = ({ containerClassName, inputClassName, value = '', onChange = noop, ...rest }) => {
    const [index, setIndex] = useState(0);
    const [input, setInput] = useState(value);
    const selectedCountry = countriesData[index];

    const handleClick = (index) => setIndex(index);

    const handleChange = ({ target }) => {
        const phoneNumber = parsePhoneNumberFromString(target.value, selectedCountry.iso2.toUpperCase());

        phoneNumber && setIndex(findIndexCountry(phoneNumber.country));
        setInput(phoneNumber ? phoneNumber.nationalNumber : target.value);
    };

    useEffect(() => {
        const phoneNumber = parsePhoneNumberFromString(value, selectedCountry.iso2.toUpperCase());
        const countryCode = phoneNumber ? phoneNumber.country : DEFAULT_COUNTRY;
        const index = findIndexCountry(countryCode);

        setIndex(index);
    }, []);

    useEffect(() => {
        const { dialCode } = countriesData[index];
        onChange(`+${dialCode}${input}`);
    }, [index, input]);

    return (
        <div className={classnames(['flex flex-nowrap', containerClassName])}>
            <SimpleDropdown
                className="rounded0-right"
                size="wide"
                content={<img width={20} src={getFlagSvg(selectedCountry.iso2)} alt={`flag-${selectedCountry.name}`} />}
                originalPlacement="bottom-left"
            >
                <DropdownMenu>
                    {countriesData.map(({ iso2, name, dialCode }, index) => (
                        <DropdownMenuButton className="alignleft" key={iso2} onClick={() => handleClick(index)}>
                            <img className="mr0-5" width={20} src={getFlagSvg(iso2)} alt={`flag-${name}`} />
                            <span className="bold mr0-5">+{dialCode}</span>
                            <span className="ellipsis">{name}</span>
                        </DropdownMenuButton>
                    ))}
                </DropdownMenu>
            </SimpleDropdown>
            <Input
                type="tel"
                className={classnames(['intltelinput-input rounded0-left', inputClassName])}
                placeholder={selectedCountry.exampleNumber}
                onChange={handleChange}
                value={input}
                {...rest}
            />
        </div>
    );
};

IntlTelInput.propTypes = {
    containerClassName: PropTypes.string,
    inputClassName: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string
};

export default IntlTelInput;
