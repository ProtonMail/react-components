import React from 'react';
import PropTypes from 'prop-types';
import { ThemeCard } from 'react-components';

const ThemeCards = ({ themeName, onChange, loading, list }) => {
    return (
        <div>
            {list.map(({ label, id, value, alt, src }) => {
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
    loading: PropTypes.bool,
    list: PropTypes.array.isRequired
};

export default ThemeCards;
