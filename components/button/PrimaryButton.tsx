import React from 'react';
import Icon from '../icon/Icon';
import Button, { Props as ButtonProps } from './Button';
import { classnames } from '../../helpers/component';

const PrimaryButton = ({ className = '', icon, ...rest }: ButtonProps) => {
    const buttonIcon = typeof icon === 'string' ? <Icon name={icon} fill="light" /> : icon;

    return <Button icon={buttonIcon} className={classnames(['pm-button--primary', className])} {...rest} />;
};

export default PrimaryButton;
