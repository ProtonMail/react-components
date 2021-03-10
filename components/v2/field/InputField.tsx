import React from 'react';

import Input, { InputTwoProps } from '../input/Input';
import FormField, { FormFieldProps } from './FormField';

interface InputFieldProps extends Omit<FormFieldProps, 'children'> {
    inputProps: InputTwoProps;
}

const InputField = ({ inputProps, ...rest }: InputFieldProps) => {
    return (
        <FormField {...rest}>
            <Input {...inputProps} />
        </FormField>
    );
};

export default InputField;
