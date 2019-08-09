import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { getCountryByAbbr } from 'react-components/helpers/countries';

// require.context would be replaced by a dummy function in tests
const flags = require.context('design-system/assets/img/shared/flags/4x3', true, /.svg$/);

const getFlagSvg = (abbreviation) => flags(`./${abbreviation.toLowerCase()}.svg`);

const Country = ({ server: { EntryCountry, ExitCountry } }) => {
    const isRouted = EntryCountry && EntryCountry !== ExitCountry;
    const exitCountryName = getCountryByAbbr(EntryCountry);

    return (
        <div className="inline-flex-vcenter">
            <img width={20} className="mr0-5" src={getFlagSvg(ExitCountry)} alt={`flag-${ExitCountry}`} />
            {getCountryByAbbr(ExitCountry)}
            {isRouted && <span className="ml0-25 opacity-50">{c('CountryInfo').t`(via ${exitCountryName})`}</span>}
        </div>
    );
};

Country.propTypes = {
    server: PropTypes.shape({
        EntryCountry: PropTypes.string,
        ExitCountry: PropTypes.string
    })
};

export default Country;
