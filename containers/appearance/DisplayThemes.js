import React from 'react';
import PropTypes from 'prop-types';
import { ThemeCard } from 'react-components';

const DisplayThemes = ({ themeObjects }) => {
    const divsToDisplay = themeObjects.map((theme) => {
        return (
            <div className="inbl mr1 mb1" key={theme.id}>
                <ThemeCard themeObject={theme} />
            </div>
        );
    });
    return <div>{divsToDisplay}</div>;
};

DisplayThemes.propTypes = {
    themeObjects: PropTypes.array.isRequired
};
