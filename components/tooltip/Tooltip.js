import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { generateUID, classnames } from '../../helpers/component';
import { usePopper, Popper, usePopperToggle } from '../Popper';

const Tooltip = ({ children, title, originalPlacement, scrollContainerClass }) => {
    const [uid] = useState(generateUID('tooltip'));

    const popperRef = useRef();
    const { anchorRef, open, close, isOpen } = usePopperToggle();
    const { position, placement } = usePopper(popperRef, anchorRef, isOpen, {
        originalPlacement,
        scrollContainerClass
    });

    return (
        <>
            <span
                ref={anchorRef}
                onMouseEnter={open}
                onMouseLeave={close}
                onFocus={open}
                onBlur={close}
                aria-describedby={uid}
            >
                {children}
            </span>
            <Popper
                ref={popperRef}
                id={uid}
                isOpen={isOpen}
                style={position}
                className={classnames(['tooltip', `tooltip--${placement}`])}
            >
                {title}
            </Popper>
        </>
    );
};

Tooltip.propTypes = {
    originalPlacement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    title: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    scrollContainerClass: PropTypes.string
};

Tooltip.defaultProps = {
    originalPlacement: 'top',
    scrollContainerClass: 'main'
};

export default Tooltip;
