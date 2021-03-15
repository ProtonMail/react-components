import React, { useRef } from 'react';

import ButtonLike, { ButtonLikeProps } from './ButtonLike';

interface ButtonProps extends Omit<ButtonLikeProps<'button'>, 'component'> {}

const Button = (props: ButtonProps) => {
     const ref = useRef<HTMLButtonElement>(null);
// think the problem is just the forwardRef typing we need to fix, yeah the ref: Ref<T> looks suspicious
    return (
        <ButtonLike component="button" type="bxutton" ref={ref} {...props}>
            henlo
        </ButtonLike>
    )
}

export default Button;
