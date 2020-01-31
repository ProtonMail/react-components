import React from 'react';
import Portal from '../portal/Portal';
import { classnames } from '../../helpers/component';

const CLASSES = {
    MODAL: 'pm-modal',
    MODAL_OUT: 'pm-modalOut',
    MODAL_SMALL: 'pm-modal--smaller',
    MODAL_WIDE: 'pm-modal--wider',
    MODAL_FULL: 'pm-modal--full',
    MODAL_AUTO: 'pm-modal--auto'
};

export interface Props {
    onExit: () => void;
    onClose: () => void;
    children: React.ReactNode;
    modalTitleID: string;
    className?: string;
    size?: 'small' | 'wide' | 'full' | 'auto';
    isBehind?: boolean;
    isClosing?: boolean;
}

const Dialog = ({
    onExit,
    size,
    isClosing = false,
    isBehind = false,
    modalTitleID,
    children,
    className: extraClassNames = '',
    ...rest
}: Props) => {
    const handleAnimationEnd = ({ animationName }: React.AnimationEvent<HTMLDialogElement>) => {
        if (animationName !== CLASSES.MODAL_OUT) {
            return;
        }
        if (!isClosing) {
            return;
        }
        if (onExit) {
            onExit();
        }
    };

    return (
        <Portal>
            <div className={classnames(['pm-modalContainer', isBehind && 'pm-modalContainer--inBackground'])}>
                <dialog
                    aria-labelledby={modalTitleID}
                    aria-modal="true"
                    role="dialog"
                    open
                    className={classnames([
                        CLASSES.MODAL,
                        size &&
                            {
                                small: CLASSES.MODAL_SMALL,
                                wide: CLASSES.MODAL_WIDE,
                                full: CLASSES.MODAL_FULL,
                                auto: CLASSES.MODAL_AUTO
                            }[size],
                        size === 'small' && 'pm-modal--shorterLabels',
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

export default Dialog;
