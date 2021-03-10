import React from 'react';
import { c } from 'ttag';

import { FormModal } from '../../../components';
import { useLoading } from '../../../hooks';
import { VerificationModel } from './interface';

interface Props {
    verificationModel: VerificationModel;
    onEdit: () => void;
    onResend: () => Promise<void>;

    [key: string]: any;
}

const RequestNewCodeModal = ({ verificationModel, onEdit, onResend, ...rest }: Props) => {
    const strong = <strong key="email">{verificationModel.value}</strong>;
    const [loading, withLoading] = useLoading();
    return (
        <FormModal
            title={c('Title').t`Request new verification code`}
            mode="alert"
            loading={loading}
            onSubmit={async () => {
                await withLoading(onResend());
                rest.onClose?.();
            }}
            submit={c('Action').t`Request new code`}
            close={
                verificationModel.method === 'email'
                    ? c('Action').t`Edit email address`
                    : c('Action').t`Edit phone number`
            }
            closeProps={{
                onClick: () => {
                    rest.onClose?.();
                    onEdit();
                },
            }}
            {...rest}
        >
            {verificationModel.method === 'email'
                ? c('Info')
                      .jt`Click "Request new code" to have a new verification code sent to ${strong}. If this email address is incorrect, click "Edit" to correct it.`
                : c('Info')
                      .jt`Click "Request new code" to have a new verification code sent to ${strong}. If this phone number is incorrect, click "Edit" to correct it.`}
        </FormModal>
    );
};

export default RequestNewCodeModal;
