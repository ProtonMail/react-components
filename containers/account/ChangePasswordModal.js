import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    Alert,
    PasswordInput,
    Input,
    Row,
    Label,
    Field,
    Icon,
    FormModal,
    Loader,
    useAuthenticationStore,
    useEventManager,
    useAddresses,
    useUser,
    useUserKeys,
    useAddressesKeys,
    useOrganizationKey,
    useOrganization,
    useApi
} from 'react-components';
import { computeKeyPassword, generateKeySalt } from 'pm-srp';
import { encryptPrivateKey } from 'pmcrypto';
import { srpAuth, srpVerify } from 'proton-shared/lib/srp';
import { unlockPasswordChanges, lockSensitiveSettings } from 'proton-shared/lib/api/user';
import { updatePassword } from 'proton-shared/lib/api/settings';
import { updatePrivateKeyRoute } from 'proton-shared/lib/api/keys';
import { PASSWORD_WRONG_ERROR } from 'proton-shared/lib/api/auth';
import { noop } from 'proton-shared/lib/helpers/function';

export const MODES = {
    CHANGE_ONE_PASSWORD_MODE: 1,
    CHANGE_TWO_PASSWORD_MAILBOX_MODE: 2,
    CHANGE_TWO_PASSWORD_LOGIN_MODE: 3,
    SWITCH_ONE_PASSWORD: 4,
    SWITCH_TWO_PASSWORD: 5
};

const getEncryptedArmoredKey = ({ Key: { ID }, privateKey }, newKeyPassword) => {
    if (!privateKey.isDecrypted()) {
        return;
    }
    return encryptPrivateKey(privateKey, newKeyPassword)
        .then((armoredPrivateKey) => {
            return { ID, PrivateKey: armoredPrivateKey };
        })
        .catch(noop);
};

const getEncryptedArmoredOrganizationKey = (organizationKey, newKeyPassword) => {
    if (!organizationKey || !organizationKey.isDecrypted()) {
        return;
    }
    return encryptPrivateKey(organizationKey, newKeyPassword).catch(noop);
};

const generateKeySaltAndPassword = async (newPassword) => {
    const newKeySalt = generateKeySalt();
    return {
        keySalt: newKeySalt,
        keyPassword: await computeKeyPassword(newPassword, newKeySalt)
    };
};

const getArmoredPrivateKeys = async ({ userKeysList, addressesKeysMap, organizationKey, keyPassword }) => {
    const userKeysPromises = userKeysList.map((key) => getEncryptedArmoredKey(key, keyPassword));
    const userKeysAndAddressesKeysPromises = Object.keys(addressesKeysMap).reduce((acc, addressKey) => {
        return acc.concat(addressesKeysMap[addressKey].map((key) => getEncryptedArmoredKey(key, keyPassword)));
    }, userKeysPromises);

    const armoredKeys = (await Promise.all(userKeysAndAddressesKeysPromises)).filter(Boolean);

    if (armoredKeys.length === 0) {
        const decryptedError = new Error('No decrypted keys exist');
        decryptedError.name = 'NoDecryptedKeys';
        throw decryptedError;
    }

    return {
        armoredKeys,
        armoredOrganizationKey: await getEncryptedArmoredOrganizationKey(organizationKey, keyPassword)
    };
};

const handleChangeMailboxPassword = ({ api, armoredKeys, armoredOrganizationKey, keySalt }) => {
    return api(
        updatePrivateKeyRoute({
            Keys: armoredKeys,
            OrganizationKey: armoredOrganizationKey,
            KeySalt: keySalt
        })
    );
};

const handleChangeOnePassword = ({ api, armoredKeys, armoredOrganizationKey, keySalt, newPassword, totp }) => {
    return srpVerify({
        api,
        credentials: { password: newPassword, totp },
        config: updatePrivateKeyRoute({
            Keys: armoredKeys,
            OrganizationKey: armoredOrganizationKey,
            KeySalt: keySalt
        })
    });
};

const handleUnlock = ({ api, oldPassword, totp }) => {
    return srpAuth({
        api,
        credentials: { password: oldPassword, totp },
        config: unlockPasswordChanges()
    });
};

const handleChangeLoginPassword = async ({ api, newPassword, totp }) => {
    return srpVerify({
        api,
        credentials: { password: newPassword, totp },
        config: updatePassword()
    });
};

const ChangePasswordModal = ({ onClose, mode, hasTotp, ...rest }) => {
    const api = useApi();
    const { call } = useEventManager();
    const authenticationStore = useAuthenticationStore();

    const [User] = useUser();
    const [Addresses, loadingAddresses] = useAddresses();
    const [Organization, loadingOrganization] = useOrganization();
    const [userKeysList, loadingUserKeys] = useUserKeys(User);
    const [addressesKeysMap, loadingAddressesKeys] = useAddressesKeys(User, Addresses);
    const [organizationKey, loadingOrganizationKey] = useOrganizationKey(Organization);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [totp, setTotp] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isSecondPhase, setSecondPhase] = useState(false);
    const [fatalError, setFatalError] = useState(false);

    const title = (() => {
        if (mode === MODES.SWITCH_ONE_PASSWORD) {
            return c('Title').t`Switch to one-password mode`;
        }

        if (mode === MODES.SWITCH_TWO_PASSWORD) {
            return c('Title').t`Switch to two-password mode`;
        }

        if (mode === MODES.CHANGE_ONE_PASSWORD_MODE) {
            return c('Title').t`Change password`;
        }

        if (mode === MODES.CHANGE_TWO_PASSWORD_LOGIN_MODE) {
            return c('Title').t`Change login password`;
        }

        if (mode === MODES.CHANGE_TWO_PASSWORD_MAILBOX_MODE) {
            return c('Title').t`Change mailbox password`;
        }
    })();

    const eye = <Icon key="0" name="read" />;
    const alert = (
        <>
            <Alert type="warning">
                {c('Info')
                    .t`Do NOT forget this password. If you forget it, you will not be able to login or decrypt your messages.`}
                <br />
                <br />
                {c('Info')
                    .jt`Save your password somewhere safe. Click on the ${eye} icon to confirm you that have typed your password correctly.`}
                <br />
                <br />
                {c('Info')
                    .t`We recommend adding a recovery email address first. Otherwise, you cannot recover your account if something goes wrong.`}
            </Alert>
        </>
    );

    const extraAlert = (() => {
        if (mode === MODES.SWITCH_ONE_PASSWORD) {
            return (
                <Alert>
                    {c('Info')
                        .t`ProtonMail can also be used with a single password which replaces both the login and mailbox password. To switch to single password mode, enter the single password you would like to use and click Save.`}
                </Alert>
            );
        }

        if (mode === MODES.SWITCH_TWO_PASSWORD && !isSecondPhase) {
            return (
                <Alert>
                    {c('Info')
                        .t`Two-password mode uses separate passwords for login and mailbox decryption. This provides a minor security benefit in some situations, however we recommend one-password mode for most users. To switch to two password mode, first set a login password and then set a mailbox password.`}
                </Alert>
            );
        }
    })();

    const { oldPasswordLabel, newPasswordLabel, confirmPasswordLabel } = (() => {
        if (mode === MODES.SWITCH_ONE_PASSWORD || mode === MODES.CHANGE_ONE_PASSWORD_MODE) {
            return {
                oldPasswordLabel: c('Label').t`Old password`,
                newPasswordLabel: c('Label').t`New password`,
                confirmPasswordLabel: c('Label').t`Confirm password`
            };
        }

        if (mode === MODES.CHANGE_TWO_PASSWORD_MAILBOX_MODE || isSecondPhase) {
            return {
                oldPasswordLabel: c('Label').t`Old login password`,
                newPasswordLabel: c('Label').t`New mailbox password`,
                confirmPasswordLabel: c('Label').t`Confirm mailbox password`
            };
        }

        if (mode === MODES.SWITCH_TWO_PASSWORD) {
            return {
                oldPasswordLabel: c('Label').t`Old password`,
                newPasswordLabel: c('Label').t`New login password`,
                confirmPasswordLabel: c('Label').t`Confirm login password`
            };
        }

        if (mode === MODES.CHANGE_TWO_PASSWORD_LOGIN_MODE) {
            return {
                oldPasswordLabel: c('Label').t`Old login password`,
                newPasswordLabel: c('Label').t`New login password`,
                confirmPasswordLabel: c('Label').t`Confirm login password`
            };
        }
    })();

    const handleSubmitMode = async () => {
        if (mode === MODES.CHANGE_TWO_PASSWORD_LOGIN_MODE) {
            await handleUnlock({ api, oldPassword, totp });
            await handleChangeLoginPassword({ api, newPassword, totp });
            await api(lockSensitiveSettings());
            return onClose();
        }

        if (mode === MODES.SWITCH_TWO_PASSWORD && !isSecondPhase) {
            await handleUnlock({ api, oldPassword, totp });
            await handleChangeLoginPassword({ api, newPassword, totp });

            setNewPassword('');
            setConfirmNewPassword('');
            setSecondPhase(true);
            setLoading(false);

            return;
        }

        if (mode === MODES.SWITCH_TWO_PASSWORD && isSecondPhase) {
            const { keyPassword, keySalt } = await generateKeySaltAndPassword(newPassword);
            const { armoredOrganizationKey, armoredKeys } = await getArmoredPrivateKeys({
                userKeysList,
                addressesKeysMap,
                organizationKey,
                keyPassword
            });
            await handleChangeMailboxPassword({ api, keySalt, armoredOrganizationKey, armoredKeys });
            authenticationStore.setPassword(keyPassword);
            await api(lockSensitiveSettings());
            await call();
            return onClose();
        }

        if (
            mode === MODES.SWITCH_ONE_PASSWORD ||
            mode === MODES.CHANGE_ONE_PASSWORD_MODE ||
            mode === MODES.CHANGE_TWO_PASSWORD_MAILBOX_MODE
        ) {
            const { keyPassword, keySalt } = await generateKeySaltAndPassword(newPassword);
            const { armoredOrganizationKey, armoredKeys } = await getArmoredPrivateKeys({
                userKeysList,
                addressesKeysMap,
                organizationKey,
                keyPassword
            });

            await handleUnlock({ api, oldPassword, totp });
            if (mode === MODES.CHANGE_TWO_PASSWORD_MAILBOX_MODE) {
                await handleChangeMailboxPassword({ api, armoredKeys, armoredOrganizationKey, keySalt });
            } else {
                await handleChangeOnePassword({ api, armoredKeys, armoredOrganizationKey, keySalt, newPassword, totp });
            }
            authenticationStore.setPassword(keyPassword);
            await api(lockSensitiveSettings());
            await call();
            return onClose();
        }
    };

    const handleSubmit = () => {
        if (confirmNewPassword !== newPassword) {
            setConfirmPasswordError(c('Error').t`Passwords do not match`);
            return;
        }
        setConfirmPasswordError();
        setLoginError();
        setLoading(true);
        handleSubmitMode().catch((e) => {
            console.error(e);
            // To display the login error under the TOTP and old password inputs.
            if (e.data && e.data.Code === PASSWORD_WRONG_ERROR) {
                setLoginError(e.data.Error);
            }
            // This error should never happen, but we might as well cover it.
            if (e.name === 'NoDecryptedKeys') {
                setFatalError(true);
            }
            setLoading(false);
        });
    };

    const isLoadingKeys =
        loadingAddresses || loadingOrganization || loadingOrganizationKey || loadingUserKeys || loadingAddressesKeys;

    const children = isLoadingKeys ? (
        <Loader />
    ) : (
        <>
            {extraAlert}
            {alert}
            {!isSecondPhase && (
                <Row>
                    <Label>{oldPasswordLabel}</Label>
                    <Field>
                        <PasswordInput
                            value={oldPassword}
                            onChange={({ target: { value } }) => setOldPassword(value)}
                            error={loginError}
                            placeholder={c('Placeholder').t`Password`}
                            required
                        />
                    </Field>
                </Row>
            )}
            <Row>
                <Label>{newPasswordLabel}</Label>
                <Field>
                    <PasswordInput
                        value={newPassword}
                        onChange={({ target: { value } }) => setNewPassword(value)}
                        error={confirmPasswordError}
                        placeholder={c('Placeholder').t`Password`}
                        required
                    />
                </Field>
            </Row>
            <Row>
                <Label>{confirmPasswordLabel}</Label>
                <Field>
                    <PasswordInput
                        value={confirmNewPassword}
                        onChange={({ target: { value } }) => setConfirmNewPassword(value)}
                        error={confirmPasswordError}
                        placeholder={c('Placeholder').t`Confirm`}
                        required
                    />
                </Field>
            </Row>
            {!isSecondPhase && hasTotp && (
                <Row>
                    <Label>{c('Label').t`Two factor authentication`}</Label>
                    <Field>
                        <Input
                            value={totp}
                            onChange={({ target: { value } }) => setTotp(value)}
                            error={loginError}
                            placeholder={c('Placeholder').t`Two factor authentication`}
                            required
                        />
                    </Field>
                </Row>
            )}
        </>
    );

    if (fatalError) {
        return (
            <FormModal
                title={title}
                close={c('Action').t`Close`}
                submit={c('Action').t`Ok`}
                onClose={onClose}
                onSubmit={onClose}
                {...rest}
            >
                <Alert type="error">{c('Error').t`Something went wrong`}</Alert>
            </FormModal>
        );
    }

    return (
        <FormModal
            title={title}
            close={c('Action').t`Close`}
            submit={c('Action').t`Save`}
            loading={loading || isLoadingKeys}
            onClose={onClose}
            onSubmit={handleSubmit}
            {...rest}
        >
            {children}
        </FormModal>
    );
};

ChangePasswordModal.propTypes = {
    onClose: PropTypes.func,
    mode: PropTypes.oneOf([...Object.values(MODES)]).isRequired,
    hasTotp: PropTypes.bool.isRequired
};

export default ChangePasswordModal;
