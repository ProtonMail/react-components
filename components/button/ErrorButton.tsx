import React from 'react';
import Button, { ButtonProps } from './Button';

export type ErrorButtonProps = Omit<ButtonProps, 'color'>;

const ErrorButton = (props: ErrorButtonProps) => {
    return <Button color="danger" {...props} />;
};

export default ErrorButton;
