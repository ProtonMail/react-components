import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    FormModal,
    Button,
    Row,
    Label,
    Input,
    PasswordInput,
    Alert,
    Select,
    useStep,
    useUser,
    useOrganization,
    useApi,
    useMembers,
    useEventManager,
    useAuthenticationStore,
    useNotifications
} from 'react-components';
import { encryptPrivateKey, generateKey } from 'pmcrypto';
import { generateKeySalt, computeKeyPassword } from 'pm-srp';
import { GIGA } from 'proton-shared/lib/constants';
import { range } from 'proton-shared/lib/helpers/array';
import humanSize from 'proton-shared/lib/helpers/humanSize';
import { updateOrganizationName, updateOrganizationKeys } from 'proton-shared/lib/api/organization';
import { updateVPN, updateQuota } from 'proton-shared/lib/api/members';
import { DEFAULT_ENCRYPTION_CONFIG, ENCRYPTION_CONFIGS } from 'proton-shared/lib/constants';

import SelectEncryption from '../keys/addKey/SelectEncryption';

const SetupOrganizationModal = ({ onClose, ...rest }) => {
    const api = useApi();
    const authenticationStore = useAuthenticationStore();
    const { call } = useEventManager();
    const { createNotification } = useNotifications();

    const [members = []] = useMembers();
    const [loading, setLoading] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState();
    const [encryptionType, setEncryptionType] = useState(DEFAULT_ENCRYPTION_CONFIG);
    const [{ MaxSpace, MaxVPN }] = useOrganization();
    const { step, next, previous } = useStep();
    const storageOptions = range(0, MaxSpace, GIGA).map((value) => ({ text: `${humanSize(value, 'GB')}`, value }));
    const vpnOptions = range(0, MaxVPN).map((value) => ({ text: value, value }));
    const [{ hasPaidVpn }] = useUser();
    const [model, setModel] = useState({
        name: '',
        password: '',
        confirm: '',
        storage: 5 * GIGA,
        vpn: 3
    });

    const wrapLoading = (promise) => {
        if (!promise) {
            return;
        }
        setLoading(true);
        return promise
            .then(() => setLoading(false))
            .catch((e) => {
                setLoading(false);
                throw e;
            });
    };

    const handleChange = (key) => ({ target }) => setModel({ ...model, [key]: target.value });

    const { ID: currentMemberID } = members.find(({ Self }) => Self) || {};

    const { title, onSubmit, section } = (() => {
        if (step === 0) {
            return {
                title: c('Title').t`Name your organization`,
                section: (
                    <Row>
                        <Label>{c('Label').t`Organization name`}</Label>
                        <Input
                            placeholder={c('Placeholder').t`Pick a name`}
                            value={model.name}
                            onChange={handleChange('name')}
                            required
                        />
                    </Row>
                ),
                async onSubmit() {
                    await api(updateOrganizationName(model.name));
                    next();
                }
            };
        }

        if (step === 1) {
            return {
                title: c('Title').t`Set organization keys`,
                section: (
                    <>
                        <Alert>{c('Info')
                            .t`This will create an encryption key for your organization. 4096-bit keys only work on high performance computers, for most users, we recommend using 2048-bit keys.`}</Alert>
                        <SelectEncryption encryptionType={encryptionType} setEncryptionType={setEncryptionType} />
                    </>
                ),
                onSubmit() {
                    next();
                }
            };
        }

        if (step === 2) {
            return {
                title: c('Title').t`Set organization password`,
                section: (
                    <>
                        <Alert>{c('Info')
                            .t`Your organization password can be shared with other users you wish to give administrative privileges. It is also an emergency recovery code to gain access to your organization in case you lose access to your account. Please save this password and keep it safe.`}</Alert>
                        <Alert type="warning">
                            {c('Info')
                                .t`Do NOT forget this password. If you forget it, you will not be able to login or decrypt your messages.`}
                            <br />
                            {c('Info')
                                .t`Save your password somewhere safe. Click on icon to confirm you that have typed your password correctly.`}
                        </Alert>
                        <Row>
                            <Label htmlFor="orgPassword">{c('Label').t`Organization password`}</Label>
                            <PasswordInput
                                id="orgPassword"
                                placeholder={c('Placeholder').t`Password`}
                                error={confirmPasswordError}
                                value={model.password}
                                onChange={handleChange('password')}
                                autoComplete="new-password"
                                required
                            />
                        </Row>
                        <Row>
                            <Label htmlFor="confirmPassword">{c('Label').t`Confirm password`}</Label>
                            <PasswordInput
                                id="confirmPassword"
                                placeholder={c('Placeholder').t`Confirm`}
                                value={model.confirm}
                                error={confirmPasswordError}
                                onChange={handleChange('confirm')}
                                autoComplete="new-password"
                                required
                            />
                        </Row>
                    </>
                ),
                async onSubmit() {
                    if (model.password !== model.confirm) {
                        return setConfirmPasswordError(c('Error').t`Passwords do not match`);
                    }
                    setConfirmPasswordError();

                    const keyPassword = authenticationStore.getPassword();

                    const { key: privateKey, privateKeyArmored: armoredPrivateKey } = await generateKey({
                        userIds: [{ name: 'not_for_email_use@domain.tld', email: 'not_for_email_use@domain.tld' }],
                        passphrase: keyPassword,
                        ...ENCRYPTION_CONFIGS[encryptionType]
                    });

                    await privateKey.decrypt(keyPassword);

                    const backupKeySalt = generateKeySalt();
                    const backupKeyPassword = await computeKeyPassword(model.password, backupKeySalt);
                    const armoredBackupPrivateKey = await encryptPrivateKey(privateKey, backupKeyPassword);

                    await api(
                        updateOrganizationKeys({
                            PrivateKey: armoredPrivateKey,
                            BackupPrivateKey: armoredBackupPrivateKey,
                            BackupKeySalt: backupKeySalt,
                            Tokens: []
                        })
                    );

                    next();
                }
            };
        }

        if (step === 3) {
            return {
                title: c('Title').t`Allocate storage`,
                section: (
                    <>
                        <Alert>{c('Info')
                            .t`Currently all available storage is allocated to the administrator account. Please reduce the admin account allocation to free up space for additional users. You can increase the total storage at any time by upgrading your account.`}</Alert>
                        <Row>
                            <Label htmlFor="storage">{c('Label').t`Account storage`}</Label>
                            <Select
                                id="storage"
                                options={storageOptions}
                                value={model.storage}
                                onChange={handleChange('storage')}
                                required
                            />
                        </Row>
                    </>
                ),
                async onSubmit() {
                    await api(updateQuota(currentMemberID, model.storage));

                    if (hasPaidVpn) {
                        return next();
                    }

                    await call();
                    createNotification({ text: c('Success').t`Organization activated` });
                    onClose();
                }
            };
        }

        if (step === 4) {
            return {
                title: c('Title').t`Allocate VPN connections`,
                section: (
                    <>
                        <Alert>{c('Info')
                            .t`Currently all available VPN connections are allocated to the administrator account. Please select the number of connections you want to reserve for additional users.`}</Alert>
                        <Row>
                            <Label htmlFor="vpn">{c('Label').t`VPN Connections`}</Label>
                            <Select
                                id="vpn"
                                options={vpnOptions}
                                value={model.vpn}
                                onChange={handleChange('vpn')}
                                required
                            />
                        </Row>
                    </>
                ),
                async onSubmit() {
                    await api(updateVPN(currentMemberID, model.vpn));
                    await call();

                    createNotification({ text: c('Success').t`Organization activated` });
                    onClose();
                }
            };
        }
    })();

    return (
        <FormModal
            title={title}
            submit={c('Action').t`Submit`}
            onClose={onClose}
            onSubmit={() => wrapLoading(onSubmit())}
            loading={loading}
            close={step ? <Button onClick={previous}>{c('Action').t`Back`}</Button> : c('Action').t`Close`}
            {...rest}
        >
            {section}
        </FormModal>
    );
};

SetupOrganizationModal.propTypes = {
    onClose: PropTypes.func
};

export default SetupOrganizationModal;
