import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-components';
import { ChromePicker } from 'react-color';

const ColorPicker = ({ text, initialColor, onColorChange, ...rest }) => {
    const [pickerState, setPickerState] = useState({
        display: false,
        color: initialColor
    });

    const rgbaColor = (color) => {
        return `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
    };

    const handleClick = () => {
        setPickerState((prevState) => {
            return {
                ...prevState,
                display: !pickerState.display
            };
        });
    };

    const handleClose = () => {
        setPickerState((prevState) => {
            return {
                ...prevState,
                display: false
            };
        });
    };

    const handleChange = (color) => {
        setPickerState((prevState) => {
            return {
                ...prevState,
                color: color
            };
        });
    };

    const popover = {
        position: 'absolute',
        zIndex: '2'
    };
    const cover = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
    };

    const picker = (
        <div style={popover}>
            <div style={cover} onClick={handleClose} />
            <ChromePicker color={pickerState.color} onChange={handleChange} />
        </div>
    );

    useEffect(() => {
        if (onColorChange) {
            onColorChange();
        }
    }, [pickerState.color]);

    return (
        <div style={{ position: 'relative' }}>
            <Button onClick={handleClick} style={{ backgroundColor: rgbaColor(pickerState.color) }} {...rest}>
                {text}
            </Button>
            {pickerState.display ? picker : null}
        </div>
    );
};

ColorPicker.propTypes = {
    text: PropTypes.string,
    initialColor: PropTypes.object,
    onColorChange: PropTypes.func
};

ColorPicker.defaultProps = {
    text: '',
    initialColor: {
        // white
        hex: '#ffffff',
        rgb: { r: 255, g: 255, b: 255, a: 1 },
        hsl: { h: 0, s: 0, l: 1, a: 1 },
        hsv: { h: 0, s: 0, v: 1, a: 1 },
        oldHue: 0
    }
};

export default ColorPicker;
