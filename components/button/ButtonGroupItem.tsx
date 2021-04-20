import React from 'react';
import { classnames } from '../../helpers';
import ButtonLike, { ButtonLikeProps } from './ButtonLike';

export type ButtonGroupItemProps = Omit<ButtonLikeProps, 'shape' | 'color' | 'size'>;

const ButtonGroupItem = ({ className, ...props }: ButtonGroupItemProps, ref: React.Ref<HTMLButtonElement>) => {
    return (
        <ButtonLike
            className={classnames(['button-group-item', className])}
            shape="ghost"
            color="weak"
            ref={ref}
            {...props}
        />
    );
};

export default React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(ButtonGroupItem);
