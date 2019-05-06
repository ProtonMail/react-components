import React from 'react';
import PropTypes from 'prop-types';
import { ThemeCard } from 'react-components';

const ThemeCards = ({ themeId, onChange, onCustomization, loading, list }) => {
    return (
        <div>
            {list.map(({ label, id, alt, src, customizable }) => {
                return (
                    <div className="inbl mr1 mb1" key={id}>
                        <ThemeCard
                            label={label}
                            id={id}
                            alt={alt}
                            src={src}
                            checked={themeId === id}
                            onChange={() => onChange(id)}
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
    themeId: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onCustomization: PropTypes.func,
    loading: PropTypes.bool,
    list: PropTypes.array.isRequired
};

export default ThemeCards;
