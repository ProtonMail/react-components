import React from 'react';
import { classnames } from '../../helpers';
import Button, { ButtonProps } from '../button/Button';
import DropdownCaret from './DropdownCaret';

export interface Props extends ButtonProps {
    loading?: boolean;
    buttonRef?: React.Ref<HTMLButtonElement>;
    icon?: React.ReactNode;
    caretClassName?: string;
    hasCaret?: boolean;
    isOpen?: boolean;
}

const DropdownButton = ({
    children,
    buttonRef,
    className,
    hasCaret = false,
    isOpen = false,
    caretClassName = '',
    disabled = false,
    loading = false,
    icon,
    ...rest
}: Props) => {
    return (
        <Button
            ref={buttonRef}
            type="button"
            className={classnames(['flex-item-noshrink', className])}
            aria-expanded={isOpen}
            aria-busy={loading}
            disabled={loading ? true : disabled}
            data-testid="dropdown-button"
            iconSide="right"
            icon={
                hasCaret ? (
                    <DropdownCaret className={classnames(['flex-item-noshrink', caretClassName])} isOpen={isOpen} />
                ) : undefined
            }
            {...rest}
        >
            {children}
        </Button>
    );
};

export default DropdownButton;
