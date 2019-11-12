import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'proton-shared/lib/helpers/function';
import { Icon, Dropdown, DropdownButton, generateUID, usePopperAnchor, LinkButton } from 'react-components';
import tinycolor from 'tinycolor2';

const COLORS = [
    '#d83078',
    '#1ac6db',
    '#db6b15',
    '#a0db13',
    '#30304d',
    '#33908f',
    '#fe5f55',
    '#f5d85d',
    '#a5cbc3',
    '#96c5f7'
];

const ColorPicker = ({ color = 'blue', onChange = noop }) => {
    const colorModel = tinycolor(color);
    const iconColor = colorModel.isValid() ? colorModel.toHexString() : '';

    const [uid] = useState(generateUID('dropdown'));
    const { anchorRef, isOpen, toggle, close } = usePopperAnchor();

    const handleClick = (color) => () => onChange({ hex: color });

    return (
        <>
            <DropdownButton buttonRef={anchorRef} isOpen={isOpen} onClick={toggle} hasCaret={true}>
                <Icon className="flex-item-noshrink" name="circle" color={iconColor} />
            </DropdownButton>
            <Dropdown id={uid} isOpen={isOpen} anchorRef={anchorRef} onClose={close}>
                <div className="p1 pt0-5 pb0-5 flex flex-row flex-wrap flex-spacearound">
                    {COLORS.map((listedColor) => (
                        <LinkButton
                            key={listedColor}
                            onClick={handleClick(listedColor)}
                            className="p0"
                            aria-pressed={listedColor === iconColor}
                        >
                            <Icon
                                size={20}
                                className="m0-5 flex-item-noshrink focus"
                                name="circle"
                                color={listedColor}
                            />
                            <span className="sr-only">Use {listedColor}</span>
                        </LinkButton>
                    ))}
                </div>
            </Dropdown>
        </>
    );
};

ColorPicker.propTypes = {
    className: PropTypes.string,
    color: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({ r: PropTypes.number, g: PropTypes.number, b: PropTypes.number, a: PropTypes.number })
    ]),
    onChange: PropTypes.func
};

export default ColorPicker;
