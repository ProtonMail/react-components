import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Portal from '../portal/Portal';

const Popper = React.forwardRef(({ children, position, isOpen, role = 'tooltip', ...rest }, ref) => {
    useEffect(() => {
        if (isOpen) {
            ref.current.focus();
        }
    }, [isOpen]);

    return (
        <Portal>
            <div
                {...rest}
                ref={ref}
                style={{
                    outline: 'none',
                    ...position
                }}
                role={role}
                hidden={!isOpen}
                aria-hidden={!isOpen}
                aria-modal="true"
                tabIndex="-1"
            >
                {children}
            </div>
        </Portal>
    );
});

Popper.propTypes = {
    children: PropTypes.node.isRequired,
    position: PropTypes.shape({ top: PropTypes.number, left: PropTypes.number }).isRequired,
    isOpen: PropTypes.bool,
    role: PropTypes.string
};

export default Popper;
