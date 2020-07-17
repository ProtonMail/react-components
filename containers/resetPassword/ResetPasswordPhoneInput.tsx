import React from 'react';
import { IntlTelInput } from '../../index';

interface Props {
    value: string;
    setValue: (phone: string) => void;
    id: string;
}
const ResetPasswordPhoneInput = ({ value, setValue, id }: Props) => {
    return (
        <IntlTelInput
            name="phone"
            id={id}
            autoFocus={true}
            value={value}
            containerClassName="w100"
            inputClassName="w100"
            dropdownContainer="body"
            onPhoneNumberChange={(status, value, countryData, number: string) => setValue(number)}
            required
        />
    );
};

export default ResetPasswordPhoneInput;
