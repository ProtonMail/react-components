import React from 'react';
import { classnames } from '../../helpers';
import ButtonLike, { ButtonLikeProps } from './ButtonLike';
import { ButtonProps } from './Button';

export type ButtonGroupItemLikeProps<T extends React.ElementType> = Omit<
    ButtonLikeProps<T>,
    'shape' | 'color' | 'size'
>;

const defaultElement = 'button';

export const ButtonGroupItemLike: <E extends React.ElementType = typeof defaultElement>(
    props: ButtonLikeProps<E>
) => React.ReactElement | null = React.forwardRef(
    <E extends React.ElementType = typeof defaultElement>(
        { className, ...rest }: ButtonGroupItemLikeProps<E>,
        ref: typeof rest.ref
    ) => {
        return (
            <ButtonLike
                className={classnames(['button-group-item', className])}
                ref={ref}
                as={defaultElement}
                {...rest}
                shape="ghost"
                color="weak"
            />
        );
    }
);

export interface ButtonGroupItemProps extends Omit<ButtonGroupItemLikeProps<'button'>, 'as' | 'ref'> {}

const ButtonGroupItem = React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
    (props: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
        return <ButtonGroupItemLike type="button" ref={ref} {...props} as="button" />;
    }
);

export default ButtonGroupItem;
