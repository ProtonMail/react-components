import React from 'react';
import { classnames } from '../../helpers';
import ButtonLike, { ButtonLikeProps } from './ButtonLike';

export type ButtonGroupItemProps<T extends React.ElementType> = Omit<ButtonLikeProps<T>, 'shape' | 'color' | 'size'>;

const defaultElement = 'button';

const ButtonGroupItem: <E extends React.ElementType = typeof defaultElement>(
    props: ButtonLikeProps<E>
) => React.ReactElement | null = React.forwardRef(
    <E extends React.ElementType = typeof defaultElement>(
        { className, ...rest }: ButtonGroupItemProps<E>,
        ref: typeof rest.ref
    ) => {
        return (
            <ButtonLike
                className={classnames(['button-group-item', className])}
                shape="ghost"
                color="weak"
                ref={ref}
                as={defaultElement}
                {...rest}
            />
        );
    }
);

export default ButtonGroupItem;
