import React from 'react';
import { classnames } from '../../helpers';

export interface InputButtonProps extends React.ComponentPropsWithoutRef<'input'> {
    id?: string;
    type?: 'checkbox' | 'radio';
    title: string;
    checked: boolean;
    labelProps?: React.ComponentPropsWithoutRef<'label'>;
}

const InputButton = ({ id, title, labelProps, checked, children, type = 'checkbox', ...rest }: InputButtonProps) => {
    const labelClassName = classnames(['inline-flex relative', labelProps?.className]);

    return (
        <label htmlFor={id} title={title} className={labelClassName}>
            <input id={id} type={type} className="button-checkbox-input sr-only" checked={checked} {...rest} />

            <span className="pm-button button-checkbox flex flex-justify-center flex-item-noshrink rounded50">
                {children}
            </span>
        </label>
    );
};

export default InputButton;
