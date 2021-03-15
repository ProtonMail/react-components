import React, { forwardRef } from 'react';

import ButtonLike, { ButtonLikeProps } from './ButtonLike';

export interface ButtonProps extends Omit<ButtonLikeProps<'button'>, 'as' | 'ref'> {}

const Button = (props: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
    return <ButtonLike as="button" type="button" ref={ref} {...props} />;
};

export default forwardRef(Button);
