import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { useApi, useLoading, LinkButton, PrimaryButton, SubTitle, useNotifications } from 'react-components';
import { Link } from 'react-router-dom';
import { getKeySalts } from 'proton-shared/lib/api/keys';
import { getUser } from 'proton-shared/lib/api/user';
import { auth2FA, getInfo, setCookies } from 'proton-shared/lib/api/auth';
import { upgradePassword } from 'proton-shared/lib/api/settings';
import loginWithFallback from 'proton-shared/lib/authentication/loginWithFallback';
import { getRandomString } from 'proton-shared/lib/helpers/string';
import { AUTH_VERSION } from 'pm-srp';
import { srpVerify } from 'proton-shared/lib/srp';
import { noop } from 'proton-shared/lib/helpers/function';
import { mergeHeaders } from 'proton-shared/lib/fetch/helpers';
import { getAuthHeaders } from 'proton-shared/lib/api';

const withAuthHeaders = (UID, AccessToken, config) => mergeHeaders(config, getAuthHeaders(UID, AccessToken));

import LoginForm from './LoginForm';
import TOTPForm from './TOTPForm';
import UnlockForm from './UnlockForm';
import { getAuthTypes, getErrorText, handleUnlockKey } from './helper';

const FORM = {
    LOGIN: 0,
    TOTP: 1,
    U2F: 2,
    UNLOCK: 3
};

const LoginContainer = ({ onLogin, ignoreUnlock = false }) => {
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

        cacheRef.current = undefined;

        await api(setCookies({ UID, AccessToken, RefreshToken, State: getRandomString(24) }));
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

        const [{ User }, { KeySalts }] =
            cacheRef.current.result ||
            (await Promise.all([
                api(withAuthHeaders(UID, AccessToken, getUser())),
                api(withAuthHeaders(UID, AccessToken, getKeySalts()))
            ]).then((result) => (cacheRef.current.result = result)));

        const { keyPassword } = await handleUnlockKey(User, KeySalts, password);

        if (authVersion < AUTH_VERSION) {
            await srpVerify({
                api,
                credentials: { password },
                config: withAuthHeaders(UID, AccessToken, upgradePassword())
            });
        }

        cacheRef.current = undefined;

        await api(setCookies({ UID, AccessToken, RefreshToken, State: getRandomString(24) }));
        onLogin({ UID, User, keyPassword, EventID });
    };

    /**
     * Step 2. Handle TOTP.
     * Unless there is another auth type active, the flow will continue until it's logged in.
     * @return {Promise}
     */
    const handleTotp = async () => {
        const {
            authResult,
            authResult: { UID, AccessToken }
        } = cacheRef.current;

        await api(withAuthHeaders(UID, AccessToken, auth2FA({ totp })));

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
        setPassword('');
        setTotp('');
        setKeyPassword('');
    };

    const formComponent = (() => {
        if (form === FORM.LOGIN) {
            const handleSubmit = (event) => {
                event.preventDefault();

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
                    <PrimaryButton type="submit" className="w100" loading={loading} data-cy-login="submit">
                        {c('Action').t`Login`}
                    </PrimaryButton>
                    <p>
                        <Link to="/support/login">{c('Action').t`Need help?`}</Link>
                    </p>
                    <p>
                        <Link to="/signup">{c('Action').t`Create an account`}</Link>
                    </p>
                </form>
            );
        }

        const cancelButton = (
            <LinkButton type="reset" disabled={loading} onClick={handleCancel}>
                {c('Action').t`Cancel`}
            </LinkButton>
        );

        if (form === FORM.TOTP) {
            const handleSubmit = (event) => {
                event.preventDefault();

                withLoading(
                    handleTotp().catch((e) => {
                        createNotification({ type: 'error', text: getErrorText(e) });

                        // 422 -> incorrect attempt, and it can be retried. Any other valid code would cancel.
                        if (e.status && e.status !== 422) {
                            return handleCancel();
                        }
                    })
                );
            };
            return (
                <form name="totpForm" onSubmit={handleSubmit}>
                    <TOTPForm totp={totp} setTotp={loading ? noop : setTotp} />
                    <PrimaryButton type="submit" className="w100" loading={loading} data-cy-login="submit TOTP">
                        {c('Action').t`Submit`}
                    </PrimaryButton>
                    <p>{cancelButton}</p>
                </form>
            );
        }

        if (form === FORM.UNLOCK) {
            const handleSubmit = (event) => {
                event.preventDefault();

                withLoading(
                    handleUnlock(keyPassword).catch((e) => {
                        createNotification({ type: 'error', text: getErrorText(e) });
                    })
                );
            };
            return (
                <form name="unlockForm" onSubmit={handleSubmit}>
                    <UnlockForm password={keyPassword} setPassword={loading ? noop : setKeyPassword} />
                    <PrimaryButton
                        type="submit"
                        className="w100"
                        loading={loading}
                        data-cy-login="submit mailbox password"
                    >
                        {c('Action').t`Submit`}
                    </PrimaryButton>
                    <p>{cancelButton}</p>
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

export default LoginContainer;
