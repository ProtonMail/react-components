import React from 'react';
import { c } from 'ttag';
import { Alert, ConfirmModal } from 'react-components';
import { PLAN_SERVICES } from 'proton-shared/lib/constants';
import { hasBit } from 'proton-shared/lib/helpers/bitset';
import { UserModel } from 'proton-shared/lib/interfaces';

interface Props {
    user: UserModel;
    onClose: () => void;
    onConfirm: () => void;
}

const { MAIL, VPN } = PLAN_SERVICES;

const DowngradeModal = ({ user, ...rest }: Props) => {
    const title = c('Title').t`Confirm downgrade`;
    const confirm = c('Action').t`Downgrade`;
    const hasMail = hasBit(user.Services, MAIL);
    const hasVpn = hasBit(user.Services, VPN);
    const hasBundle = hasMail && hasVpn;

    return (
        <ConfirmModal title={title} confirm={confirm} {...rest}>
            <Alert>{c('Info').t`Your account will be downgraded in a few minutes.`}</Alert>
            <Alert type="error">
                {hasBundle
                    ? c('Info')
                          .t`If you proceed with the downgrade, you will lose access to the paid features for ProtonMail and ProtonVPN.`
                    : c('Info').t`If you proceed with the downgrade, you will lose access to the paid features.`}
            </Alert>
            <Alert type="warning">
                {hasBundle
                    ? c('Info')
                          .t`Additional ProtonMail addresses, custom domains, and users must be removed/disabled before performing this action. Any connections to premium ProtonVPN servers will be terminated.`
                    : hasMail
                    ? c('Info')
                          .t`Additional ProtonMail addresses, custom domains, and users must be removed/disabled before performing this action.`
                    : c('Info').t`Any connections to premium ProtonVPN servers will be terminated.`}
            </Alert>
        </ConfirmModal>
    );
};

export default DowngradeModal;
