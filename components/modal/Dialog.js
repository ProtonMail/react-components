import React from 'react';
import PropTypes from 'prop-types';
import Portal from '../portal/Portal';
import { classnames } from '../../helpers/component';
import useFocusTrap from '../../hooks/useFocusTrap';

const CLASSES = {
    MODAL: 'pm-modal',
    MODAL_OUT: 'pm-modalOut',
    MODAL_SMALL: 'pm-modal--smaller'
};

/** @type any */
const Dialog = ({
    onExit,
    small: isSmall = false,
    isClosing = false,
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    isFirst = false,
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    isLast = false,
    isBehind = false,
    modalTitleID,
    children,
    className: extraClassNames = '',
    ...rest
}) => {
    const handleAnimationEnd = ({ animationName }) => {
        if (animationName === CLASSES.MODAL_OUT && isClosing) {
            onExit && onExit();
        }
    };

    const { onKeyDown, ref } = useFocusTrap();

    return (
        <Portal>
            <div
                className={classnames(['pm-modalContainer', isBehind && 'pm-modalContainer--inBackground'])}
                ref={ref}
                onKeyDown={onKeyDown}
            >
                <dialog
                    aria-labelledby={modalTitleID}
                    aria-modal="true"
                    role="dialog"
                    open
                    className={classnames([
                        CLASSES.MODAL,
                        isSmall && CLASSES.MODAL_SMALL,
                        isSmall && 'pm-modal--shorterLabels',
                        isClosing && CLASSES.MODAL_OUT,
                        extraClassNames
                    ])}
                    onAnimationEnd={handleAnimationEnd}
                    {...rest}
                >
                    {children}
                </dialog>
            </div>
        </Portal>
    );
};

Dialog.propTypes = {
    onExit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    modalTitleID: PropTypes.string.isRequired,
    className: PropTypes.string,
    small: PropTypes.bool,
    isBehind: PropTypes.bool,
    isFirst: PropTypes.bool,
    isLast: PropTypes.bool,
    isClosing: PropTypes.bool
};

export default Dialog;
