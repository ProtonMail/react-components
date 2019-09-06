import React from 'react';
import PropTypes from 'prop-types';
import Input from './Input';
import SimpleDropdown from '../dropdown/SimpleDropdown';
import { classnames } from '../../helpers/component';
import useIntlTelNumbers from '../../hooks/useIntlTelNumbers';
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

const IntlTelInput = ({ containerClassName, inputClassName, ...rest }) => {
    const { countries, getClickHandler, selectedCountry } = useIntlTelNumbers();
    return (
        <div className={classnames(['flex flex-nowrap', containerClassName])} {...rest}>
            <SimpleDropdown
                className="rounded0-right"
                size="wide"
                content={<img width={20} src={getFlagSvg(selectedCountry.iso2)} alt={`flag-${selectedCountry.name}`} />}
                originalPlacement="bottom-left"
            >
                <ul className="dropDown-contentInner intltelinput-list">
                    {countries.map(({ iso2, name, dialCode }, index) => (
                        <li key={name} className="dropDown-item" onClick={getClickHandler(index)}>
                            <button className="w100 pt0-5 pb0-5 alignleft">
                                <img className="mr0-5" width={20} src={getFlagSvg(iso2)} alt={`flag-${name}`} />
                                {name}
                                <span className="smaller color-global-altgrey">+{dialCode}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </SimpleDropdown>
            <Input
                className={classnames(['intltelinput-input rounded0-left', inputClassName])}
                placeholder={selectedCountry.exampleNumber}
            />
        </div>
    );
};

IntlTelInput.propTypes = {
    containerClassName: PropTypes.string,
    inputClassName: PropTypes.string
};

export default IntlTelInput;
