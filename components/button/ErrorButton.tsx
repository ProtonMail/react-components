import React, { ReactNode } from 'react';
import Icon from '../icon/Icon';
import Button, { Props as ButtonProps } from './Button';
import { classnames } from '../../helpers/component';

interface Props extends ButtonProps {
    icon?: ReactNode;
}

const ErrorButton = ({ children, className = '', icon, ...rest }: Props) => {
    const buttonIcon = typeof icon === 'string' ? <Icon name={icon} className="color-global-light" /> : icon;
    return (
        <Button icon={buttonIcon} className={classnames(['pm-button--error', className])} {...rest}>
            {children}
        </Button>
    );
};

export default ErrorButton;
