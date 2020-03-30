import React from 'react';
import Icon from '../icon/Icon';
import Button, { Props as ButtonProps } from './Button';
import { classnames } from '../../helpers/component';

const WarningButton = ({ children, className = '', icon, ...rest }: ButtonProps) => {
    const buttonIcon = typeof icon === 'string' ? <Icon name={icon} /> : icon;

    return (
        <Button icon={buttonIcon} className={classnames(['pm-button--warning', className])} {...rest}>
            {children}
        </Button>
    );
};

export default WarningButton;
