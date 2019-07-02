import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    Alert,
    PasswordInput,
    TwoFactorInput,
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
    useUserSettings,
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

/**
 * Encrypt a private key with a new password if it's decrypted.
 * @param {String} ID
 * @param {Object} privateKey
 * @param {String} newKeyPassword
 * @return {Promise}
 */
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

/**
 * Encrypt the organization key with a new password if it exists.
 * @param {Object} organizationKey
 * @param {String} newKeyPassword
 * @return {Promise}
 */
const getEncryptedArmoredOrganizationKey = (organizationKey, newKeyPassword) => {
    if (!organizationKey || !organizationKey.isDecrypted()) {
        return;
    }
    return encryptPrivateKey(organizationKey, newKeyPassword).catch(noop);
};

/**
 * Get the new key salt and password.
 * @param {String} newPassword
 * @return {Promise}
 */
const generateKeySaltAndPassword = async (newPassword) => {
    const newKeySalt = generateKeySalt();
    return {
        keySalt: newKeySalt,
        keyPassword: await computeKeyPassword(newPassword, newKeySalt)
    };
};

/**
 * Get all private keys encrypted with a new password.
 * @param {Array} userKeysList
 * @param {Object} addressesKeysMap
 * @param {Object} organizationKey
 * @param {String} keyPassword
 * @return {Promise}
 */
const getArmoredPrivateKeys = async ({ userKeysList, addressesKeysMap, organizationKey, keyPassword }) => {
    const userKeysPromises = userKeysList.map((key) => getEncryptedArmoredKey(key, keyPassword));
    const userKeysAndAddressesKeysPromises = Object.keys(addressesKeysMap).reduce((acc, addressKey) => {
        return acc.concat(addressesKeysMap[addressKey].map((key) => getEncryptedArmoredKey(key, keyPassword)));
    }, userKeysPromises);

    const armoredKeys = (await Promise.all(userKeysAndAddressesKeysPromises)).filter(Boolean);

    // There should always be some decrypted in the mail application.
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

const ChangePasswordModal = ({ onClose, mode, ...rest }) => {
    const api = useApi();
    const { call } = useEventManager();
    const authenticationStore = useAuthenticationStore();

    const [User] = useUser();
    const [{ '2FA': { Enabled } } = {}, loadingUserSettings] = useUserSettings();
    const [Addresses, loadingAddresses] = useAddresses();
    const [Organization, loadingOrganization] = useOrganization();
    const [userKeysList, loadingUserKeys] = useUserKeys(User);
    const [addressesKeysMap, loadingAddressesKeys] = useAddressesKeys(User, Addresses);
    const [organizationKey, loadingOrganizationKey] = useOrganizationKey(Organization);

    const [inputs, setInputs] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        totp: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        loginError: '',
        confirmPasswordError: '',
        fatalError: false
    });
    const [isSecondPhase, setSecondPhase] = useState(false);

    const validateConfirmPassword = () => {
        if (inputs.confirmPassword !== inputs.newPassword) {
            setErrors({ confirmPasswordError: c('Error').t`Passwords do not match` });
            throw new Error('PasswordMatch');
        }
    };

    const checkLoginError = ({ data: { Code, Error } = {} }) => {
        if (Code === PASSWORD_WRONG_ERROR) {
            setErrors({ loginError: Error });
        }
    };

    const checkFatalError = (e) => {
        if (e.name === 'NoDecryptedKeys') {
            setErrors({ fatalError: true });
        }
    };

    const setInput = (object) => setInputs((oldState) => ({ ...oldState, ...object }));
    const resetErrors = () => setErrors({});

    const { labels, extraAlert, ...modalProps } = (() => {
        if (mode === MODES.CHANGE_TWO_PASSWORD_LOGIN_MODE) {
            return {
                title: c('Title').t`Change login password`,
                labels: {
                    oldPassword: c('Label').t`Old login password`,
                    newPassword: c('Label').t`New login password`,
                    confirmPassword: c('Label').t`Confirm login password`
                },
                async onSubmit() {
                    try {
                        validateConfirmPassword();
                        resetErrors();
                        setLoading(true);

                        await handleUnlock({ api, oldPassword: inputs.oldPassword, totp: inputs.totp });
                        await handleChangeLoginPassword({ api, newPassword: inputs.newPassword, totp: inputs.totp });
                        await api(lockSensitiveSettings());

                        onClose();
                    } catch (e) {
                        setLoading(false);
                        checkLoginError(e);
                    }
                }
            };
        }

        if (mode === MODES.SWITCH_TWO_PASSWORD && !isSecondPhase) {
            return {
                title: c('Title').t`Switch to two-password mode`,
                extraAlert: (
                    <Alert>
                        {c('Info')
                            .t`Two-password mode uses separate passwords for login and mailbox decryption. This provides a minor security benefit in some situations, however we recommend one-password mode for most users. To switch to two password mode, first set a login password and then set a mailbox password.`}
                    </Alert>
                ),
                labels: {
                    oldPassword: c('Label').t`Old password`,
                    newPassword: c('Label').t`New login password`,
                    confirmPassword: c('Label').t`Confirm login password`
                },
                async onSubmit() {
                    try {
                        validateConfirmPassword();
                        resetErrors();
                        setLoading(true);

                        await handleUnlock({ api, oldPassword: inputs.oldPassword, totp: inputs.totp });
                        await handleChangeLoginPassword({ api, newPassword: inputs.newPassword, totp: inputs.totp });

                        setSecondPhase(true);
                        setInputs({ newPassword: '', confirmPassword: '' });
                        setLoading(false);
                    } catch (e) {
                        setLoading(false);
                        checkLoginError(e);
                    }
                }
            };
        }

        if (mode === MODES.SWITCH_TWO_PASSWORD && isSecondPhase) {
            return {
                title: c('Title').t`Switch to two-password mode`,
                labels: {
                    newPassword: c('Label').t`New mailbox password`,
                    confirmPassword: c('Label').t`Confirm mailbox password`
                },
                async onSubmit() {
                    try {
                        validateConfirmPassword();
                        resetErrors();
                        setLoading(true);

                        const { keyPassword, keySalt } = await generateKeySaltAndPassword(inputs.newPassword);
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

                        onClose();
                    } catch (e) {
                        setLoading(false);
                        checkFatalError(e);
                    }
                }
            };
        }

        const onSubmit = async () => {
            try {
                validateConfirmPassword();
                resetErrors();
                setLoading(true);

                const { keyPassword, keySalt } = await generateKeySaltAndPassword(inputs.newPassword);
                const { armoredOrganizationKey, armoredKeys } = await getArmoredPrivateKeys({
                    userKeysList,
                    addressesKeysMap,
                    organizationKey,
                    keyPassword
                });

                await handleUnlock({ api, oldPassword: inputs.oldPassword, totp: inputs.totp });
                if (mode === MODES.CHANGE_TWO_PASSWORD_MAILBOX_MODE) {
                    await handleChangeMailboxPassword({ api, armoredKeys, armoredOrganizationKey, keySalt });
                } else {
                    await handleChangeOnePassword({
                        api,
                        armoredKeys,
                        armoredOrganizationKey,
                        keySalt,
                        newPassword: inputs.newPassword,
                        totp: inputs.totp
                    });
                }
                authenticationStore.setPassword(keyPassword);
                await api(lockSensitiveSettings());
                await call();

                onClose();
            } catch (e) {
                setLoading(false);
                checkFatalError(e);
                checkLoginError(e);
            }
        };

        if (mode === MODES.SWITCH_ONE_PASSWORD) {
            return {
                title: c('Title').t`Switch to one-password mode`,
                labels: {
                    oldPassword: c('Label').t`Old login password`,
                    newPassword: c('Label').t`New password`,
                    confirmPassword: c('Label').t`Confirm password`
                },
                extraAlert: (
                    <Alert>
                        {c('Info')
                            .t`ProtonMail can also be used with a single password which replaces both the login and mailbox password. To switch to single password mode, enter the single password you would like to use and click Save.`}
                    </Alert>
                ),
                onSubmit
            };
        }

        if (mode === MODES.CHANGE_ONE_PASSWORD_MODE) {
            return {
                title: c('Title').t`Change password`,
                labels: {
                    oldPassword: c('Label').t`Old password`,
                    newPassword: c('Label').t`New password`,
                    confirmPassword: c('Label').t`Confirm password`
                },
                onSubmit
            };
        }

        if (mode === MODES.CHANGE_TWO_PASSWORD_MAILBOX_MODE) {
            return {
                title: c('Title').t`Change mailbox password`,
                labels: {
                    oldPassword: c('Label').t`Old login password`,
                    newPassword: c('Label').t`New mailbox password`,
                    confirmPassword: c('Label').t`Confirm mailbox password`
                },
                onSubmit
            };
        }
    })();

    const isLoadingKeys =
        loadingAddresses ||
        loadingUserSettings ||
        loadingOrganization ||
        loadingOrganizationKey ||
        loadingUserKeys ||
        loadingAddressesKeys;

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

    const hasTotp = !!Enabled;

    const children = isLoadingKeys ? (
        <Loader />
    ) : (
        <>
            {extraAlert}
            {alert}
            {!isSecondPhase && (
                <Row>
                    <Label>{labels.oldPassword}</Label>
                    <Field>
                        <PasswordInput
                            value={inputs.oldPassword}
                            onChange={({ target: { value } }) => setInput({ oldPassword: value })}
                            error={errors.loginError}
                            placeholder={c('Placeholder').t`Password`}
                            required
                        />
                    </Field>
                </Row>
            )}
            {!isSecondPhase && hasTotp && (
                <Row>
                    <Label>{c('Label').t`Two factor code`}</Label>
                    <Field>
                        <TwoFactorInput
                            value={inputs.totp}
                            onChange={({ target: { value } }) => setInput({ totp: value })}
                            error={errors.loginError}
                            placeholder={c('Placeholder').t`Two factor code`}
                            required
                        />
                    </Field>
                </Row>
            )}
            <Row>
                <Label>{labels.newPassword}</Label>
                <Field>
                    <PasswordInput
                        value={inputs.newPassword}
                        onChange={({ target: { value } }) => setInput({ newPassword: value })}
                        error={errors.confirmPasswordError}
                        placeholder={c('Placeholder').t`Password`}
                        required
                    />
                </Field>
            </Row>
            <Row>
                <Label>{labels.confirmPassword}</Label>
                <Field>
                    <PasswordInput
                        value={inputs.confirmPassword}
                        onChange={({ target: { value } }) => setInput({ confirmPassword: value })}
                        error={errors.confirmPasswordError}
                        placeholder={c('Placeholder').t`Confirm`}
                        required
                    />
                </Field>
            </Row>
        </>
    );

    if (errors.fatalError) {
        return (
            <FormModal
                close={c('Action').t`Close`}
                submit={c('Action').t`Ok`}
                onClose={onClose}
                {...modalProps}
                onSubmit={onClose}
                {...rest}
            >
                <Alert type="error">{c('Error').t`Something went wrong`}</Alert>
            </FormModal>
        );
    }

    return (
        <FormModal
            close={c('Action').t`Close`}
            submit={c('Action').t`Save`}
            loading={loading || isLoadingKeys}
            onClose={onClose}
            {...modalProps}
            {...rest}
        >
            {children}
        </FormModal>
    );
};

ChangePasswordModal.propTypes = {
    onClose: PropTypes.func,
    mode: PropTypes.oneOf([...Object.values(MODES)]).isRequired
};

export default ChangePasswordModal;
