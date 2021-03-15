import React from 'react';
import Icon from '../icon/Icon';
import Button, { ButtonProps } from './Button';
import { classnames } from '../../helpers';

interface Props extends ButtonProps {
    icon: string;
    title?: string;
    className?: string;
}

const FloatingButton = ({ icon, title, className, ...rest }: Props) => {
    return (
        <Button color="norm" className={classnames(['fab flex', className])} {...rest}>
            <Icon size={24} className="mauto" name={icon} alt={title} />
        </Button>
    );
};

export default FloatingButton;
