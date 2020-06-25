import React from 'react';
import { Link } from 'react-router-dom';
import { c } from 'ttag';
import { noop } from 'proton-shared/lib/helpers/function';
import { API_CUSTOM_ERROR_CODES } from 'proton-shared/lib/errors';

import { useLoading, InlineLinkButton, PrimaryButton, SupportDropdown, useNotifications, useModals } from '../..';
import PasswordForm from './PasswordForm';
import TOTPForm from './TOTPForm';
import RecoveryForm from './RecoveryForm';
import UnlockForm from './UnlockForm';
import { getErrorText } from './helper';
import AbuseModal from './AbuseModal';
import SignLayout from '../signup/SignLayout';
import BackButton from '../signup/BackButton';
import ProtonLogo from '../../components/logo/ProtonLogo';
import OneAccountIllustration from '../illustration/OneAccountIllustration';
import useLogin, { Props as UseLoginProps, FORM } from './useLogin';

const LoginForm = ({ onLogin, ignoreUnlock = false }: UseLoginProps) => {
    const { createNotification } = useNotifications();
    const { createModal } = useModals();
    const {
        state,
        handleLogin,
        handleTotp,
        handleUnlock,
        handleCancel,
        setUsername,
        setPassword,
        setKeyPassword,
        setTotp,
        setIsTotpRecovery
    } = useLogin({ onLogin, ignoreUnlock });

    const [loading, withLoading] = useLoading();

    const { form, username, password, isTotpRecovery, totp, keyPassword } = state;

    if (state.form === FORM.LOGIN) {
        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            withLoading(
                handleLogin().catch((e) => {
                    if (e.data && e.data.Code === API_CUSTOM_ERROR_CODES.AUTH_ACCOUNT_DISABLED) {
                        createModal(<AbuseModal />);
                    }
                })
            );
        };

        const signupLink = (
            <Link key="signupLink" className="nodecoration" to="/signup">{c('Link').t`Create an account`}</Link>
        );

        return (
            <SignLayout title={c('Title').t`Sign in`} center={<ProtonLogo />} aside={<OneAccountIllustration />}>
                <form name="loginForm" className="signup-form" onSubmit={handleSubmit}>
                    <PasswordForm
                        username={username}
                        setUsername={loading ? noop : setUsername}
                        password={password}
                        setPassword={loading ? noop : setPassword}
                    />
                    <div className="mb1">
                        <SupportDropdown noCaret={true} className="link">
                            {c('Action').t`Need help?`}
                        </SupportDropdown>
                    </div>
                    <div className="alignright mb2">
                        <PrimaryButton
                            type="submit"
                            className="pm-button--large"
                            loading={loading}
                            data-cy-login="submit"
                        >
                            {c('Action').t`Sign in`}
                        </PrimaryButton>
                    </div>
                </form>
                <div className="mb2 alignright">{c('Info').jt`New to Proton? ${signupLink}`}</div>
            </SignLayout>
        );
    }

    if (form === FORM.TOTP) {
        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            withLoading(
                handleTotp().catch((e) => {
                    // In case of any other error than retry error, automatically cancel here to allow the user to retry.
                    if (e.name !== 'RetryTOTPError') {
                        return handleCancel();
                    }
                })
            );
        };
        return (
            <SignLayout
                title={c('Title').t`Two-factor authentication`}
                left={<BackButton onClick={handleCancel} />}
                center={<ProtonLogo />}
                right={
                    <SupportDropdown noCaret={true} className="link">
                        {c('Action').t`Need help?`}
                    </SupportDropdown>
                }
            >
                <form name="totpForm" className="signup-form" onSubmit={handleSubmit} autoComplete="off">
                    {isTotpRecovery ? (
                        <RecoveryForm code={totp} setCode={loading ? noop : setTotp} />
                    ) : (
                        <TOTPForm totp={totp} setTotp={loading ? noop : setTotp} />
                    )}
                    <div className="mb1">
                        <InlineLinkButton
                            onClick={() => {
                                setTotp('');
                                setIsTotpRecovery(!isTotpRecovery);
                            }}
                        >
                            {isTotpRecovery ? c('Action').t`Use two-factor code` : c('Action').t`Use recovery code`}
                        </InlineLinkButton>
                    </div>
                    <div className="alignright mb1">
                        <PrimaryButton
                            type="submit"
                            disabled={!totp}
                            className="pm-button--large"
                            loading={loading}
                            data-cy-login="submit TOTP"
                        >
                            {c('Action').t`Authenticate`}
                        </PrimaryButton>
                    </div>
                </form>
            </SignLayout>
        );
    }

    if (form === FORM.UNLOCK) {
        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            withLoading(
                handleUnlock(keyPassword).catch((e) => {
                    // In case of any other error than password error, automatically cancel here to allow the user to retry.
                    if (e.name !== 'PasswordError') {
                        return handleCancel();
                    } else {
                        createNotification({ type: 'error', text: getErrorText(e) });
                    }
                })
            );
        };
        return (
            <SignLayout
                title={c('Title').t`Unlock your mailbox`}
                left={<BackButton onClick={handleCancel} />}
                center={<ProtonLogo />}
                right={
                    <SupportDropdown noCaret={true} className="link">
                        {c('Action').t`Need help?`}
                    </SupportDropdown>
                }
            >
                <form name="unlockForm" className="signup-form" onSubmit={handleSubmit}>
                    <UnlockForm password={keyPassword} setPassword={loading ? noop : setKeyPassword} />
                    <div className="alignright mb1">
                        <PrimaryButton
                            type="submit"
                            className="pm-button--large"
                            disabled={!keyPassword}
                            loading={loading}
                            data-cy-login="submit mailbox password"
                        >
                            {c('Action').t`Unlock`}
                        </PrimaryButton>
                    </div>
                </form>
            </SignLayout>
        );
    }

    if (form === FORM.U2F) {
        throw new Error('U2F not implemented');
    }

    throw new Error('Unsupported form');
};

export default LoginForm;
