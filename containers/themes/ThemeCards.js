import React from 'react';
import PropTypes from 'prop-types';
import { ThemeCard } from 'react-components';

const ThemeCards = ({ list, themeMode, onChange, disabled }) => {
    return (
        <div>
            {list.map(({ label, id, value, alt, src }, index) => {
                return (
                    <div className="inbl mr1 mb1" key={index.toString()}>
                        <ThemeCard
                            label={label}
                            id={id}
                            value={value}
                            checked={themeMode === index}
                            alt={alt}
                            src={src}
                            onChange={onChange}
                            disabled={disabled}
                        />
                    </div>
                );
            })}
        </div>
    );
};

ThemeCards.propTypes = {
    list: PropTypes.array.isRequired,
    themeMode: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

export default ThemeCards;
