import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { useApi, useLoading, Button, SubTitle, useNotifications } from 'react-components';
import { Link } from 'react-router-dom';
import { decryptPrivateKey } from 'pmcrypto';
import { getKeySalts } from 'proton-shared/lib/api/keys';
import { getUser } from 'proton-shared/lib/api/user';
import { auth2FA, getInfo, setCookies } from 'proton-shared/lib/api/auth';
import { upgradePassword } from 'proton-shared/lib/api/settings';
import loginWithFallback from 'proton-shared/lib/authentication/loginWithFallback';
import { getRandomString } from 'proton-shared/lib/helpers/string';
import { AUTH_VERSION, computeKeyPassword } from 'pm-srp';
import { srpVerify } from 'proton-shared/lib/srp';
import { noop } from 'proton-shared/lib/helpers/function';
import { withUIDHeaders } from 'proton-shared/lib/authentication/helpers';
import { getPrimaryKeyWithSalt } from 'proton-shared/lib/keys/keys';

import LoginForm from './LoginForm';
import TOTPForm from './TOTPForm';
import UnlockForm from './UnlockForm';

const FORM = {
    LOGIN: 0,
    TOTP: 1,
    U2F: 2,
    UNLOCK: 3
};

const getAuthTypes = ({ '2FA': { Enabled }, PasswordMode } = {}) => {
    return {
        hasTotp: Enabled & 1,
        hasU2F: Enabled & 2,
        hasUnlock: PasswordMode !== 1
    };
};

const getErrorText = (error) => {
    if (error.name === 'PasswordError') {
        return c('Error').t`Incorrect decryption password`;
    }
    if (error.data && error.data.Error) {
        return error.data.Error;
    }
    return error.message;
};

const handleUnlockKey = async (User, KeySalts, rawKeyPassword) => {
    const { KeySalt, PrivateKey } = getPrimaryKeyWithSalt(User.Keys, KeySalts);

    // Support for versions without a key salt.
    const keyPassword = KeySalt ? await computeKeyPassword(rawKeyPassword, KeySalt) : rawKeyPassword;
    const primaryKey = await decryptPrivateKey(PrivateKey, keyPassword).catch(() => {
        const error = new Error('Wrong private key password');
        error.name = 'PasswordError';
        throw error;
    });

    return { primaryKey, keyPassword };
};

const LoginContainer = ({ onLogin, ignoreUnlock }) => {
    const { createNotification } = useNotifications();
    const cacheRef = useRef();
    const api = useApi();

    const [loading, withLoading] = useLoading();
    const [form, setForm] = useState(FORM.LOGIN);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [totp, setTotp] = useState('');
    const [keyPassword, setKeyPassword] = useState('');

    /**
     * Special case for the admin panel which does not need to unlock.
     * @return {Promise}
     */
    const handleIgnoreUnlock = async () => {
        const {
            authResult: { UID, AccessToken, RefreshToken }
        } = cacheRef.current;
        await api(setCookies({ UID, AccessToken, RefreshToken, State: getRandomString(24) }));

        cacheRef.current = undefined;
        onLogin({ UID });
    };

    /**
     * Step 3. Handle unlock.
     * Attempt to decrypt the primary private key with the password.
     * @return {Promise}
     */
    const handleUnlock = async (password) => {
        const {
            authVersion,
            authResult: { UID, EventID, AccessToken, RefreshToken }
        } = cacheRef.current;

        if (!cacheRef.current.hasCookies) {
            await api(setCookies({ UID, AccessToken, RefreshToken, State: getRandomString(24) }));
            cacheRef.current.hasCookies = true;
        }

        const [{ User }, { KeySalts }] =
            cacheRef.current.result ||
            (await Promise.all([api(withUIDHeaders(UID, getUser())), api(withUIDHeaders(UID, getKeySalts()))]).then(
                (result) => (cacheRef.current.result = result)
            ));

        const { keyPassword } = await handleUnlockKey(User, KeySalts, password);

        if (authVersion < AUTH_VERSION) {
            await srpVerify({
                api,
                credentials: { password },
                config: withUIDHeaders(UID, upgradePassword())
            });
        }

        cacheRef.current = undefined;
        onLogin({ UID, userResult: User, keyPassword, EventID });
    };

    /**
     * Step 2. Handle TOTP.
     * Unless there is another auth type active, the flow will continue until it's logged in.
     * @return {Promise}
     */
    const handleTotp = async () => {
        const {
            authResult,
            authResult: { UID }
        } = cacheRef.current;

        await api(withUIDHeaders(UID, auth2FA({ totp })));

        const { hasU2F, hasUnlock } = getAuthTypes(authResult);

        if (hasU2F) {
            return setForm(FORM.U2F);
        }

        if (ignoreUnlock) {
            return handleIgnoreUnlock();
        }

        if (hasUnlock) {
            return setForm(FORM.UNLOCK);
        }

        return handleUnlock(password);
    };

    /**
     * Step 1. Handle the initial auth.
     * Unless there is an auth type active, the flow will continue until it's logged in.
     * @return {Promise}
     */
    const handleLogin = async () => {
        const infoResult = await api(getInfo(username));
        const { authVersion, result: authResult } = await loginWithFallback({
            api,
            credentials: { username, password },
            initalAuthInfo: infoResult
        });
        cacheRef.current = { authVersion, authResult };

        const { hasTotp, hasU2F, hasUnlock } = getAuthTypes(authResult);

        if (hasTotp) {
            return setForm(FORM.TOTP);
        }

        if (hasU2F) {
            return setForm(FORM.U2F);
        }

        if (ignoreUnlock) {
            return handleIgnoreUnlock();
        }

        if (hasUnlock) {
            return setForm(FORM.UNLOCK);
        }

        return handleUnlock(password);
    };

    const handleCancel = () => {
        cacheRef.current = undefined;
        setForm(FORM.LOGIN);
    };

    const formComponent = (() => {
        if (form === FORM.LOGIN) {
            const handleSubmit = () => {
                withLoading(
                    handleLogin().catch((e) => {
                        createNotification({ type: 'error', text: getErrorText(e) });
                        cacheRef.current = undefined;
                    })
                );
            };
            return (
                <form name="loginForm" onSubmit={handleSubmit}>
                    <LoginForm
                        username={username}
                        setUsername={loading ? noop : setUsername}
                        password={password}
                        setPassword={loading ? noop : setPassword}
                    />
                    <Button type="submit" className="pm-button-blue w100" loading={loading} data-cy-login="submit">
                        Login
                    </Button>
                    <p>
                        <Link to="/support/login">Need help?</Link>
                    </p>
                    <p>
                        <Link to="/signup">Create an account</Link>
                    </p>
                </form>
            );
        }

        if (form === FORM.TOTP) {
            const handleSubmit = () => {
                withLoading(
                    handleTotp().catch((e) => {
                        createNotification({ type: 'error', text: getErrorText(e) });
                    })
                );
            };
            return (
                <form name="totpForm" onSubmit={handleSubmit}>
                    <TOTPForm totp={totp} setTotp={loading ? noop : setTotp} />
                    <Button type="reset" disabled={loading} onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading} data-cy-login="submit TOTP">
                        Submit
                    </Button>
                </form>
            );
        }

        if (form === FORM.UNLOCK) {
            const handleSubmit = () => {
                withLoading(
                    handleUnlock(keyPassword).catch((e) => {
                        createNotification({ type: 'error', text: getErrorText(e) });
                    })
                );
            };
            return (
                <form name="unlockForm" onSubmit={handleSubmit}>
                    <UnlockForm password={keyPassword} setPassword={loading ? noop : setKeyPassword} />
                    <Button type="reset" disabled={loading} onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading} data-cy-login="submit mailbox password">
                        Submit
                    </Button>
                </form>
            );
        }

        if (form === FORM.U2F) {
            return 'U2F not implemented';
        }

        throw new Error('Unsupported form');
    })();

    return (
        <div className="mauto w400e mw100 p2 bordered-container flex-item-noshrink">
            <SubTitle>{c('Login').t`User login`}</SubTitle>
            {formComponent}
        </div>
    );
};

LoginContainer.propTypes = {
    onLogin: PropTypes.func.isRequired,
    ignoreUnlock: PropTypes.bool
};

LoginContainer.defaultProps = {
    ignoreUnlock: false
};

export default LoginContainer;
