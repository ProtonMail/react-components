import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { generateUID } from '../../helpers/component';
import usePopper from './usePopper';

const Tooltip = ({ children, title, placement, scrollContainerClass }) => {
    const [uid] = useState(generateUID('tooltip'));
    const { position, visible, show, hide, wrapperRef, tooltipRef } = usePopper({ placement, scrollContainerClass });
    const { top, left, placement: adjustedPlacement } = position;

    return (
        <span className="tooltip-container" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
            <span ref={wrapperRef} aria-describedby={uid}>
                {children}
            </span>
            {ReactDOM.createPortal(
                <span
                    ref={tooltipRef}
                    style={{ top, left }}
                    className={`tooltip-${adjustedPlacement}`}
                    id={uid}
                    role="tooltip"
                    aria-hidden={!visible}
                >
                    {title}
                </span>,
                document.body
            )}
        </span>
    );
};

Tooltip.propTypes = {
    placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    title: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    scrollContainerClass: PropTypes.string
};

Tooltip.defaultProps = {
    placement: 'top',
    scrollContainerClass: 'main'
};

export default Tooltip;
