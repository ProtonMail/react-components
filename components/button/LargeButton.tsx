import React from 'react';
import Button, { ButtonProps } from './Button';

export type LargeButtonProps = Omit<ButtonProps, 'size'>;

const LargeButton = (props: LargeButtonProps) => {
    return <Button size="large" {...props} />;
};

export default LargeButton;
