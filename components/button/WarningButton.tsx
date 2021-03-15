import React from 'react';
import Button, { ButtonProps } from './Button';

export type WarningButtonProps = Omit<ButtonProps, 'color'>;

const WarningButton = (props: WarningButtonProps) => {
    return <Button color="warning" {...props} />;
};

export default WarningButton;
