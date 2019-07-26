import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { generateUID } from '../../helpers/component';

const TOOLTIP_OFFSET = 10;

const calculatePosition = (target, tooltip, placement) => {
    let top;
    let left;

    if (placement === 'top') {
        top = target.top - tooltip.height - TOOLTIP_OFFSET;
        left = target.left + target.width / 2 - tooltip.width / 2;
    }

    if (placement === 'bottom') {
        top = target.top + target.height + TOOLTIP_OFFSET;
        left = target.left + target.width / 2 - tooltip.width / 2;
    }

    if (placement === 'left') {
        top = target.top + target.height / 2 - tooltip.height / 2;
        left = target.left - tooltip.width - TOOLTIP_OFFSET;
    }

    if (placement === 'right') {
        top = target.top + target.height / 2 - tooltip.height / 2;
        left = target.left + target.width + TOOLTIP_OFFSET;
    }

    return { top, left };
};

const SuperTooltip = ({ children, title, placement }) => {
    const tooltipRef = useRef();
    const wrapperRef = useRef();
    const [uid] = useState(generateUID('tooltip'));
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ top: -1000, left: -1000 });

    useEffect(() => {
        const updatePosition = () => {
            if (visible && wrapperRef.current && tooltipRef.current) {
                const targetBounds = wrapperRef.current.getBoundingClientRect();
                const tooltipBounds = tooltipRef.current.getBoundingClientRect();
                setPosition(calculatePosition(targetBounds, tooltipBounds, placement));
            } else {
                setPosition({ top: -1000, left: -1000 });
            }
        };

        const contentArea = document.querySelector('.main');
        contentArea.addEventListener('scroll', updatePosition);
        updatePosition();

        return () => {
            contentArea.removeEventListener('scroll', updatePosition);
        };
    }, [visible]);

    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    const tooltip = ReactDOM.createPortal(
        <span
            ref={tooltipRef}
            style={position}
            className={`tooltip-${placement}`}
            id={uid}
            role="tooltip"
            aria-hidden={!visible}
        >
            {title}
        </span>,
        document.body
    );

    return (
        <span className="tooltip-container" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
            <span ref={wrapperRef} aria-describedby={uid}>
                {children}
            </span>
            {tooltip}
        </span>
    );
};

SuperTooltip.propTypes = {
    placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    title: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired
};

SuperTooltip.defaultProps = {
    placement: 'top'
};

export default SuperTooltip;
