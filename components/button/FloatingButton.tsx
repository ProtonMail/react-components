import React from 'react';
import { classnames } from '../../helpers';
import Button from './Button';

interface Props extends ButtonProps {
    icon: string;
    title?: string;
    className?: string;
}

const FloatingButton = ({ icon, title, className, ...rest }: Props) => {
    return (
        <Button
            color="norm"
            icon={icon}
            iconProps={{
                size: 24,
                className: 'mauto',
                alt: title,
            }}
            className={classnames(['fab flex', className])}
            {...rest}
        />
    );
};

export default FloatingButton;
