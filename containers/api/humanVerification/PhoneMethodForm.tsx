import { c } from 'ttag';
import React, { useState } from 'react';
import { noop } from 'proton-shared/lib/helpers/function';
import { Api } from 'proton-shared/lib/interfaces';
import { validatePhone } from 'proton-shared/lib/api/core/validate';
import { getApiErrorMessage } from 'proton-shared/lib/api/helpers/apiErrorHelper';
import { requiredValidator } from 'proton-shared/lib/helpers/formValidators';
import { FormField, Button, useFormErrors, PhoneInput } from '../../../components';
import { useLoading } from '../../../hooks';

interface Props {
    onSubmit: (phone: string) => Promise<void>;
    defaultPhone?: string;
    defaultCountry?: string;
    api: Api;
}

const EmailMethodForm = ({ api, onSubmit, defaultPhone = '', defaultCountry }: Props) => {
    const [phone, setPhone] = useState(defaultPhone);
    const [loading, withLoading] = useLoading();

    const { validator, setError, onFormSubmit } = useFormErrors();

    const handleSubmit = async () => {
        if (loading || !onFormSubmit()) {
            return;
        }

        try {
            await api(validatePhone(phone));
        } catch (error) {
            setError('phone', getApiErrorMessage(error) || c('Error').t`Can't validate phone, try again later`);
            throw error;
        }

        await onSubmit(phone);
    };

    return (
        <>
            <FormField
                id="phone"
                bigger
                label={c('Label').t`Phone number`}
                error={validator('phone', [requiredValidator(phone)])}
            >
                <PhoneInput
                    disableChange={loading}
                    autoFocus
                    defaultCountry={defaultCountry}
                    value={phone}
                    onChange={setPhone}
                />
            </FormField>
            <Button
                size="large"
                color="norm"
                type="button"
                className="w100"
                loading={loading}
                onClick={() => withLoading(handleSubmit()).catch(noop)}
            >
                {c('Action').t`Get verification code`}
            </Button>
        </>
    );
};

export default EmailMethodForm;
