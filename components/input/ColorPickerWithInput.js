import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LargeButton, Input } from 'react-components';
import { ChromePicker } from 'react-color';
import { default as tinycolor } from 'tinycolor2';
import './ColorPicker.css';

const ColorPickerWithInput = ({ initialRgbaColor, onColorChange, ...rest }) => {
    const [display, setDisplay] = useState(false);
    const [rgbaColor, setRgbaColor] = useState(initialRgbaColor);
    const [inputHex, setInputHex] = useState(tinycolor(initialRgbaColor).toHexString());

    const rgbaColorString = (rgbaColor) => {
        return `rgba(${rgbaColor.r}, ${rgbaColor.g}, ${rgbaColor.b}, ${rgbaColor.a})`;
    };
    const handleClick = () => {
        setDisplay(!display);
    };
    const handleClose = () => {
        setDisplay(false);
    };
    const handleButtonChange = (color) => {
        setRgbaColor(color.rgb);
        setInputHex(color.hex);
    };
    const handleInputChange = (e) => {
        const colorHex = e.target.value;
        setRgbaColor(tinycolor(colorHex).toRgb());
        setInputHex(colorHex);
    };

    const picker = (
        <div className="popover">
            <div className="cover" onClick={handleClose} />
            <ChromePicker color={rgbaColor} onChange={handleButtonChange} />
        </div>
    );

    useEffect(() => {
        if (onColorChange) {
            onColorChange();
        }
    }, [rgbaColor]);

    return (
        <>
            <span className="inbl mr1">
                <div className="relative">
                    <LargeButton
                        onClick={handleClick}
                        style={{ backgroundColor: rgbaColorString(rgbaColor) }}
                        {...rest}
                    >
                        {' '}
                    </LargeButton>
                    {display ? picker : null}
                </div>
            </span>
            <span className="inbl">
                <Input value={inputHex} onChange={handleInputChange} />
            </span>
        </>
    );
};

ColorPickerWithInput.propTypes = {
    text: PropTypes.string,
    initialRgbaColor: PropTypes.object,
    onColorChange: PropTypes.func
};

ColorPickerWithInput.defaultProps = {
    initialRgbaColor: { r: 255, g: 255, b: 255, a: 1 } // white
};

export default ColorPickerWithInput;
