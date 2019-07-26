import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { generateUID } from '../../helpers/component';

const TOOLTIP_OFFSET = 10;

const SuperTooltip = ({ children, title, placement }) => {
    const tooltipRef = useRef();
    const wrapperRef = useRef();
    const [uid] = useState(generateUID('tooltip'));
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ top: -1000, left: -1000 });

    const updatePosition = useCallback(() => {
        if (visible && wrapperRef.current && tooltipRef.current) {
            const targetBounds = wrapperRef.current.getBoundingClientRect();
            const tooltipBounds = tooltipRef.current.getBoundingClientRect();
            const top = targetBounds.top - tooltipBounds.height - TOOLTIP_OFFSET;
            const left = targetBounds.left + targetBounds.width / 2 - tooltipBounds.width / 2;
            setPosition({ top, left });
        } else {
            setPosition({ top: -1000, left: -1000 });
        }
    }, [visible]);

    useEffect(() => {
        updatePosition();
    }, [visible]);

    useEffect(() => {
        const contentArea = document.querySelector('.main');
        contentArea.addEventListener('scroll', updatePosition);
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
