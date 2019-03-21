import React from 'react';
import PropTypes from 'prop-types';
import { ThemeCard } from 'react-components';

const ThemeCards = ({ list = [] }) => {
    return (
        <div>
            {list.map(({ label, id, value, alt, src }, index) => {
                return (
                    <div className="inbl mr1 mb1" key={index.toString()}>
                        <ThemeCard label={label} id={id} value={value} alt={alt} src={src} />
                    </div>
                );
            })}
        </div>
    );
};

ThemeCards.propTypes = {
    list: PropTypes.array.isRequired
};

export default ThemeCards;
