import React from 'react';
import Button, { ButtonProps } from './Button';

export type PrimaryButtonProps = Omit<ButtonProps, 'color'>;

const PrimaryButton = (props: PrimaryButtonProps, ref: React.Ref<HTMLButtonElement>) => {
    return <Button color="norm" shape="solid" ref={ref} {...props} />;
};

export default React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(PrimaryButton);
