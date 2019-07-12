import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'proton-shared/lib/helpers/function';
import { Button } from 'react-components';
import { ChromePicker } from 'react-color';

import './ColorPicker.scss';

const toBackgroundColor = (color) => {
    return color instanceof String ? color : `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
};

const ColorPicker = ({ children, initialColor, onChange, ...rest }) => {
    const [display, setDisplay] = useState(false);
    const [color, setColor] = useState(initialColor);

    const handleClick = () => {
        setDisplay(!display);
    };
    const handleClose = () => {
        setDisplay(false);
    };
    const handleChange = (color) => {
        setColor(color.rgb);
        onChange(color);
    };

    const picker = (
        <div className="popover">
            <div className="cover" onClick={handleClose} />
            <ChromePicker color={color} onChange={handleChange} />
        </div>
    );

    return (
        <div className="relative">
            <Button onClick={handleClick} style={{ backgroundColor: toBackgroundColor(color) }} {...rest}>
                {children}
            </Button>
            {display ? picker : null}
        </div>
    );
};

ColorPicker.propTypes = {
    children: PropTypes.node.isRequired,
    initialColor: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            r: PropTypes.number,
            g: PropTypes.number,
            b: PropTypes.number,
            a: PropTypes.number
        })
    ]),
    onChange: PropTypes.func
};

ColorPicker.defaultProps = {
    initialRgbaColor: '#ffffff', // white
    onChange: noop
};

export default ColorPicker;
