import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-components';
import { ChromePicker } from 'react-color';

const ColorPicker = ({ disabled, onChange, initialColor }) => {
    const [pickerState, setPickerState] = useState({
        display: false,
        color: initialColor
    });

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
                color: color.hex
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
            <ChromePicker onChange={handleChange} />
        </div>
    );

    return (
        <div style={{ position: 'relative' }}>
            <Button
                onClick={handleClick}
                onChange={onChange}
                disabled={disabled}
                style={{ backgroundColor: pickerState.color }}
            >
                Pick Color
            </Button>
            {pickerState.display ? picker : null}
        </div>
    );
};

ColorPicker.propTypes = {
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    initialColor: PropTypes.string
};

ColorPicker.defaultProps = {
    initialColor: 'white'
};

export default ColorPicker;
