import React from 'react';
import { classnames } from '../../helpers';

export interface InputButtonProps extends React.ComponentPropsWithoutRef<'input'> {
    id?: string;
    type?: 'checkbox' | 'radio';
    title: string;
    checked: boolean;
    labelProps?: React.ComponentPropsWithoutRef<'label'>;
}

const InputButton = ({
    id,
    title,
    checked,
    children,
    type = 'checkbox',
    labelProps = {},
    ...rest
}: InputButtonProps) => {
    const { className: labelClassNameProp, ...labelPropsRest } = labelProps;

    const labelClassName = classnames(['inline-flex relative', labelClassNameProp]);

    return (
        <label htmlFor={id} title={title} className={labelClassName} {...labelPropsRest}>
            <input id={id} type={type} className="input-button-input sr-only" checked={checked} {...rest} />

            <span className="button-henlo input-button flex flex-justify-center flex-item-noshrink rounded50">
                {children}
            </span>
        </label>
    );
};

export default InputButton;
