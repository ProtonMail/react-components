import React from 'react';
import { classnames } from '../../helpers';
import { Vr } from '../vr';

type Shape = 'outline' | 'ghost';

type Size = 'small' | 'medium' | 'large';

interface Props {
    children: React.ReactNode;
    shape?: Shape;
    size?: Size;
    className?: string;
}

const ButtonGroup = (
    { children, shape = 'outline', size = 'medium', className = '' }: Props,
    ref: React.Ref<HTMLDivElement>
) => {
    const childrenWithSeparators = React.Children.toArray(children)
        .filter((x) => x !== null && React.isValidElement(x))
        .map((child, index, array) => {
            if (index === array.length - 1) {
                return child;
            }
            return (
                <>
                    {child}
                    <Vr aria-hidden="true" />
                </>
            );
        });
    return (
        <div
            className={classnames(['button-group', `button-group-${shape}`, `button-group-${size}`, className])}
            ref={ref}
        >
            {childrenWithSeparators}
        </div>
    );
};

export default React.forwardRef<HTMLDivElement, Props>(ButtonGroup);
