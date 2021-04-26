import React, { ReactElement } from 'react';
import { classnames } from '../../helpers';
import { Vr } from '../vr';

type Shape = 'outline' | 'ghost';

type Size = 'small' | 'medium' | 'large';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    children: React.ReactNode;
    shape?: Shape;
    size?: Size;
    className?: string;
}

const ButtonGroup = (
    { children, shape = 'outline', size = 'medium', className = '', ...rest }: Props,
    ref: React.Ref<HTMLDivElement>
) => {
    const childrenWithSeparators = React.Children.toArray(children)
        .filter((x) => x !== null && React.isValidElement(x))
        .map((child, index, array) => {
            const clonedChild = React.cloneElement(child as ReactElement, { group: true });
            if (index === array.length - 1) {
                return clonedChild;
            }
            return (
                <>
                    {clonedChild}
                    <Vr aria-hidden="true" />
                </>
            );
        });
    return (
        <div
            className={classnames(['button-group', `button-group-${shape}`, `button-group-${size}`, className])}
            ref={ref}
            {...rest}
        >
            {childrenWithSeparators}
        </div>
    );
};

export default React.forwardRef<HTMLDivElement, Props>(ButtonGroup);
