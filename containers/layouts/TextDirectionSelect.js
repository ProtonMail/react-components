import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Select } from 'react-components';
import { RIGHT_TO_LEFT } from 'proton-shared/lib/constants';

const { ON: right_to_left, OFF: left_to_right } = RIGHT_TO_LEFT;

const TextDirectionSelect = ({ rightToLeft, onChange, loading }) => {
    const options = [
        { text: c('Option').t`Left to Right`, value: left_to_right },
        { text: c('Option').t`Right to Left`, value: right_to_left }
    ];

    const handleChange = ({ target }) => {
        onChange(target.value);
    };

    return <Select value={rightToLeft} options={options} disabled={loading} onChange={handleChange} />;
};

TextDirectionSelect.propTypes = {
    rightToLeft: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    loading: PropTypes.bool
};

export default TextDirectionSelect;
