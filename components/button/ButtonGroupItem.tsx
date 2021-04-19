import React from 'react';
import { classnames } from '../../helpers';
import Button, { ButtonProps } from './Button';

export type ButtonGroupItemProps = Omit<ButtonProps, 'shape' | 'color' | 'size'>;

const ButtonGroupItem = ({ className, ...props }: ButtonGroupItemProps, ref: React.Ref<HTMLButtonElement>) => {
    return (
        <Button
            className={classnames(['button-group-item', className])}
            shape="ghost"
            color="weak"
            ref={ref}
            {...props}
        />
    );
};

export default React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(ButtonGroupItem);
