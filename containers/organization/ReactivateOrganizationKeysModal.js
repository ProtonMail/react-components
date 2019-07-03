import React, { useState } from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { activateOrganizationKey, getOrganizationBackupKeys } from 'proton-shared/lib/api/organization';
import {
    useEventManager,
    useLoading,
    useNotifications,
    useAuthenticationStore,
    useApi,
    FormModal,
    LearnMore,
    Alert,
    Row,
    Label,
    Field,
    PasswordInput
} from 'react-components';

import { decryptArmoredKey } from '../keys/reactivateKeys/ReactivateKeysModal';
import { encryptPrivateKey } from 'pmcrypto';

const ReactivateOrganizationKeysModal = ({ onClose, mode, ...rest }) => {
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const authenticationStore = useAuthenticationStore();
    const api = useApi();

    const [loading, withLoading] = useLoading();
    const [backupPassword, setBackupPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        try {
            setError('');

            const { PrivateKey, KeySalt } = await api(getOrganizationBackupKeys());
            const decryptedPrivateKey = await decryptArmoredKey({
                armoredPrivateKey: PrivateKey,
                password: backupPassword,
                keySalt: KeySalt
            });
            const armoredPrivateKey = await encryptPrivateKey(decryptedPrivateKey, authenticationStore.getPassword());
            await api(activateOrganizationKey(armoredPrivateKey));
            await call();

            createNotification({ text: c('Success').t`Organization keys activated` });
            onClose();
        } catch (e) {
            setError(e.message);
        }
    };

    const { title, message, warning } = (() => {
        if (mode === 'reactivate') {
            return {
                title: c('Title').t`Reactivate organization keys`,
                message: c('Info')
                    .t`You must activate your organization private key with the backup organization key password provided to you by your organization administrator.`,
                warning: c('Info')
                    .t`Without activation you will not be able to create new users, add addresses to existing users, or access non-private user accounts.`
            };
        }

        if (mode === 'activate') {
            const learnMore = <LearnMore url="https://protonmail.com/support/knowledge-base/restore-administrator/" />;
            return {
                title: c('Title').t`Reactivate organization keys`,
                message: c('Info')
                    .jt`Enter the Organization Password to restore administrator privileges. ${learnMore}`,
                warning: c('Info')
                    .t`If another administrator changed this password, you will need to ask them for the new Organization Password.`
            };
        }
    })();

    return (
        <FormModal
            title={title}
            close={c('Action').t`Close`}
            submit={c('Action').t`Submit`}
            onClose={onClose}
            loading={loading}
            onSubmit={() => withLoading(handleSubmit())}
            {...rest}
        >
            <Alert>{message}</Alert>
            <Row>
                <Label htmlFor="organizationPassword">{c('Label').t`Organization password`}</Label>
                <Field>
                    <PasswordInput
                        id="organizationPassword"
                        value={backupPassword}
                        onChange={({ target: { value } }) => setBackupPassword(value)}
                        error={error}
                        placeholder={c('Placeholder').t`Password`}
                        autoComplete="off"
                        required
                    />
                </Field>
            </Row>
            <Alert type="warning">{warning}</Alert>
        </FormModal>
    );
};

ReactivateOrganizationKeysModal.propTypes = {
    onClose: PropTypes.func,
    mode: PropTypes.oneOf(['activate', 'reactivate'])
};

export default ReactivateOrganizationKeysModal;
