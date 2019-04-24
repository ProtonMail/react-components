import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input, ColorPicker } from 'react-components';
import { default as tinycolor } from 'tinycolor2';

const ColorPickerWithInput = ({ initialRgbaColor, onChange, ...rest }) => {
    const [rgbaColor, setRgbaColor] = useState(initialRgbaColor);
    const [inputHex, setInputHex] = useState(tinycolor(initialRgbaColor).toHexString());

    const handleColorPickerChange = (color) => {
        setRgbaColor(color.rgb);
    };
    const handleInputChange = (e) => {
        const colorHex = e.target.value;
        setRgbaColor(tinycolor(colorHex).toRgb());
        setInputHex(colorHex);
    };

    useEffect(() => {
        if (onChange) {
            onChange();
        }
    }, [rgbaColor]);

    return (
        <>
            <span className="inbl mr1">
                <ColorPicker onChange={handleColorPickerChange} initialRgbaColor={rgbaColor} {...rest} />
            </span>
            <span className="inbl">
                <Input value={inputHex} onChange={handleInputChange} />
            </span>
        </>
    );
};

ColorPickerWithInput.propTypes = {
    initialRgbaColor: PropTypes.object,
    onChange: PropTypes.func
};

ColorPickerWithInput.defaultProps = {
    initialRgbaColor: { r: 255, g: 255, b: 255, a: 1 } // white
};

export default ColorPickerWithInput;
