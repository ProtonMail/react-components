import React from 'react';
import PropTypes from 'prop-types';
import { ThemeCard } from 'react-components';

const ThemeCards = ({ themeMode, onChange, loading, list }) => {
    return (
        <div>
            {list.map(({ label, id, value, alt, src }) => {
                return (
                    <div className="inbl mr1 mb1" key={alt}>
                        <ThemeCard
                            label={label}
                            id={id}
                            value={value}
                            alt={alt}
                            src={src}
                            checked={themeMode === value}
                            themeObject={{ label, id, value, alt, src }}
                            onChange={onChange}
                            disabled={loading}
                        />
                    </div>
                );
            })}
        </div>
    );
};

ThemeCards.propTypes = {
    themeMode: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
    onChange: PropTypes.func,
    loading: PropTypes.bool,
    list: PropTypes.array.isRequired
};

export default ThemeCards;
