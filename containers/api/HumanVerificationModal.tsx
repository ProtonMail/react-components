import React, { useState } from 'react';
import { API_CUSTOM_ERROR_CODES } from 'proton-shared/lib/errors';
import { c } from 'ttag';

import { FormModal, useNotifications } from '../../index';
import './HumanVerificationModal.scss';
import HumanVerificationForm, { MethodType } from './HumanVerificationForm';

interface Props<T> {
    token: string;
    methods: MethodType[];
    onSuccess: (data: T) => void;
    onVerify: (token: string, tokenType: string) => Promise<T>;
    [key: string]: any;
}
const HumanVerificationModal = <T,>({ token, methods = [], onSuccess, onVerify, ...rest }: Props<T>) => {
    const title = c('Title').t`Human verification`;
    const { createNotification } = useNotifications();
    const [resetCaptchaKey, setResetCaptchaKey] = useState(0);

    const handleSubmit = async (token: string, tokenType: string) => {
        try {
            const result = await onVerify(token, tokenType);
            createNotification({ text: c('Success').t`Verification successful` });
            rest.onClose();
            onSuccess(result);
        } catch (error) {
            const { data: { Code } = { Code: 0 } } = error;

            if (Code === API_CUSTOM_ERROR_CODES.TOKEN_INVALID) {
                createNotification({ text: c('Error').t`Invalid verification code`, type: 'error' });
            }

            if (tokenType === 'captcha') {
                setResetCaptchaKey((o) => ++o);
            }
        }
    };

    return (
        <FormModal
            className="human-verification-modal pm-modal--heightAuto"
            hasClose={false}
            title={title}
            footer={null}
            {...rest}
        >
            <HumanVerificationForm
                captchaKey={resetCaptchaKey}
                onSubmit={handleSubmit}
                methods={methods}
                token={token}
            />
        </FormModal>
    );
};

export default HumanVerificationModal;
