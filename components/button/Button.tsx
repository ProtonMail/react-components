import React from 'react';
import Icon from '../icon/Icon';
import { classnames } from '../../helpers/component';
import { useTestId } from '../testId/TestId';

export interface Props
    extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    loading?: boolean;
    buttonRef?: React.Ref<HTMLButtonElement>;
    icon?: React.ReactNode;
}

const Button = ({
    type = 'button',
    role = 'button',
    loading = false,
    disabled = false,
    className,
    tabIndex,
    buttonRef,
    children,
    icon,
    ...rest
}: Props) => {
    const iconComponent = typeof icon === 'string' ? <Icon className="flex-item-noshrink" name={icon} /> : icon;
    const iconButtonClass = !children ? 'pm-button--for-icon' : '';
    const testId = useTestId('Button');

    return (
        <button
            role={role}
            disabled={loading ? true : disabled}
            className={classnames(['pm-button', iconButtonClass, className])}
            type={type}
            tabIndex={disabled ? -1 : tabIndex}
            ref={buttonRef}
            aria-busy={loading}
            data-test-id={testId}
            {...rest}
        >
            {iconComponent}
            {children}
        </button>
    );
};

export default Button;
