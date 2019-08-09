import React from 'react';
import { Radio } from 'react-components';
import PropTypes from 'prop-types';

const RadioGroup = ({ name, options, onChange, value }) => {
    const handleChangePlatform = (optionValue) => () => onChange(optionValue);

    return options.map((option, i) => (
        <Radio
            key={i}
            onChange={handleChangePlatform(option.value)}
            checked={value === option.value}
            name={name}
            className="mr2 flex inline-flex-vcenter"
        >
            {option.label}
        </Radio>
    ));
};

RadioGroup.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.node,
            value: PropTypes.any
        }).isRequired
    )
};

export default RadioGroup;
