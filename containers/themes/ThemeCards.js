import React from 'react';
import PropTypes from 'prop-types';
import { ThemeCard } from 'react-components';

const ThemeCards = ({ themeName, onChange, onCustomization, loading, list }) => {
    return (
        <div>
            {list.map(({ label, id, value, alt, src, customizable }) => {
                return (
                    <div className="inbl mr1 mb1" key={value}>
                        <ThemeCard
                            label={label}
                            id={id}
                            value={value}
                            alt={alt}
                            src={src}
                            checked={themeName === value}
                            onChange={() => onChange(value)}
                            disabled={loading}
                            customizable={customizable}
                            onCustomization={onCustomization}
                        />
                    </div>
                );
            })}
        </div>
    );
};

ThemeCards.propTypes = {
    themeName: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onCustomization: PropTypes.func,
    loading: PropTypes.bool,
    list: PropTypes.array.isRequired
};

export default ThemeCards;
