import React, { useState } from 'react';
import { c } from 'ttag';
import { updatePhone } from 'proton-shared/lib/api/settings';
import { requiredValidator } from 'proton-shared/lib/helpers/formValidators';

import AuthModal from '../password/AuthModal';
import { ConfirmModal, Alert, Button, InputFieldTwo, PhoneInput, useFormErrors } from '../../components';
import { useLoading, useModals, useNotifications, useEventManager } from '../../hooks';

import './RecoveryPhone.scss';

interface Props {
    phone: string | null;
    hasReset: boolean;
    defaultCountry?: string;
}

const RecoveryPhone = ({ phone, hasReset, defaultCountry }: Props) => {
    const [input, setInput] = useState(phone || '');
    const [loading, withLoading] = useLoading();
    const { createNotification } = useNotifications();
    const { createModal } = useModals();
    const { call } = useEventManager();
    const { validator, onFormSubmit } = useFormErrors();

    const handleSubmit = async () => {
        if (!input && hasReset) {
            await new Promise<void>((resolve, reject) => {
                createModal(
                    <ConfirmModal title={c('Title').t`Confirm phone number`} onConfirm={resolve} onClose={reject}>
                        <Alert type="warning">
                            {c('Warning')
                                .t`By deleting this phone number, you will no longer be able to recover your account.`}
                            <br />
                            <br />
                            {c('Warning').t`Are you sure you want to delete the phone number?`}
                        </Alert>
                    </ConfirmModal>
                );
            });
        }

        await new Promise((resolve, reject) => {
            createModal(<AuthModal onClose={reject} onSuccess={resolve} config={updatePhone({ Phone: input })} />);
        });

        await call();
        createNotification({ text: c('Success').t`Phone number updated` });
    };

    return (
        <form
            className="recovery-phone_container"
            onSubmit={(e) => {
                e.preventDefault();
                if (onFormSubmit()) {
                    withLoading(handleSubmit());
                }
            }}
        >
            <div className="text-ellipsis mr1">
                <InputFieldTwo
                    as={PhoneInput}
                    id="phoneInput"
                    error={validator([requiredValidator(input)])}
                    disableChange={loading}
                    autoFocus
                    defaultCountry={defaultCountry}
                    value={input}
                    onChange={(value: string) => {
                        setInput(value);
                    }}
                />
            </div>
            <div>
                <Button
                    color="norm"
                    type="submit"
                    disabled={(phone || '') === input}
                    loading={loading}
                    onClick={() => withLoading(handleSubmit())}
                >
                    {c('Action').t`Update`}
                </Button>
            </div>
        </form>
    );
};

export default RecoveryPhone;
