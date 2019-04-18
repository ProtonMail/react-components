import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { SubTitle, Alert, ThemeCards } from 'react-components';
import { themeDark, themeLight, themeBlue, themeCompany, themeTest } from './availableThemes.js';

const availableThemes = [themeDark, themeLight, themeBlue, themeCompany, themeTest];

const ThemesSection = ({ themeMode, onChange, loading }) => {
    const dummyText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium enim nec massa fringilla, ac ultrices tortor posuere. Fusce sed quam vitae arcu pharetra congue. Quisque in elementum nibh.';

    return (
        <>
            <SubTitle>{c('Title').t`Themes`}</SubTitle>
            <Alert learnMore="todo">{c('Info').t`${dummyText}`}</Alert>
            <br />
            <ThemeCards list={availableThemes} themeMode={themeMode} onChange={onChange} disabled={loading} />
        </>
    );
};

ThemesSection.propTypes = {
    themeMode: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    loading: PropTypes.bool
};

export default ThemesSection;
