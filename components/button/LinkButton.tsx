import React from 'react';
import Button, { ButtonProps } from './Button';

export type LinkButtonProps = Omit<ButtonProps, 'shape'>;

const LinkButton = (props: LinkButtonProps) => {
    return <Button shape="link" {...props} />;
};

export default LinkButton;
