import React from 'react';
import Button, { ButtonProps } from './Button';

export type PrimaryButtonProps = Omit<ButtonProps, 'color'>;

const PrimaryButton = (props: PrimaryButtonProps) => {
    return <Button color="norm" {...props} />;
};

export default PrimaryButton;
