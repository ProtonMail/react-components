import React from 'react';
import Button, { ButtonProps } from './Button';

export type LargeButtonProps = Omit<ButtonProps, 'size'>;

const SmallButton = (props: LargeButtonProps) => {
    return <Button size="small" {...props} />;
};

export default SmallButton;
