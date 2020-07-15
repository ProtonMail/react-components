import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { c } from 'ttag';
import { noop } from 'proton-shared/lib/helpers/function';
import { API_CUSTOM_ERROR_CODES } from 'proton-shared/lib/errors';

import {
    useLoading,
    InlineLinkButton,
    PrimaryButton,
    AccountSupportDropdown,
    useNotifications,
    useModals,
    Label
} from '../..';
import { getErrorText } from './helper';
import AbuseModal from './AbuseModal';
import { Props as AccountPublicLayoutProps } from '../signup/AccountPublicLayout';
import BackButton from '../signup/BackButton';
import OneAccountIllustration from '../illustration/OneAccountIllustration';
import useLogin, { Props as UseLoginProps, FORM } from './useLogin';
import LoginUsernameInput from './LoginUsernameInput';
import LoginPasswordInput from './LoginPasswordInput';
import LoginTotpInput from './LoginTotpInput';
import LoginRecoveryCodeInput from './LoginRecoveryCodeInput';
import LoginUnlockInput from './LoginUnlockInput';

interface Props extends UseLoginProps {
    Layout: FunctionComponent<AccountPublicLayoutProps>;
}

const AccountLoginContainer = ({ onLogin, ignoreUnlock = false, Layout }: Props) => {
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

        const usernameInput = (
            <div className="flex onmobile-flex-column signup-label-field-container mb0-5">
                <Label htmlFor="login">{c('Label').t`Email or Username`}</Label>
                <div className="flex-item-fluid">
                    <LoginUsernameInput id="login" username={username} setUsername={loading ? noop : setUsername} />
                </div>
            </div>
        );

        const passwordInput = (
            <div className="flex onmobile-flex-column signup-label-field-container mb0-5">
                <Label htmlFor="password">{c('Label').t`Password`}</Label>
                <div className="flex-item-fluid">
                    <LoginPasswordInput password={password} setPassword={loading ? noop : setPassword} id="password" />
                </div>
            </div>
        );

        return (
            <Layout title={c('Title').t`Sign in`} aside={<OneAccountIllustration />}>
                <form name="loginForm" className="signup-form" onSubmit={handleSubmit}>
                    {usernameInput}
                    {passwordInput}
                    <div className="mb1">
                        <AccountSupportDropdown noCaret={true} className="link">
                            {c('Action').t`Need help?`}
                        </AccountSupportDropdown>
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
            </Layout>
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

        const totpForm = (
            <div className="flex onmobile-flex-column signup-label-field-container mb0-5">
                <Label htmlFor="twoFa">{c('Label').t`Two-factor code`}</Label>
                <div className="flex-item-fluid">
                    <LoginTotpInput totp={totp} setTotp={loading ? noop : setTotp} id="twoFa" />
                </div>
            </div>
        );

        const recoveryForm = (
            <div className="flex onmobile-flex-column signup-label-field-container mb0-5">
                <Label htmlFor="twoFa">{c('Label').t`Two-factor code`}</Label>
                <div className="flex-item-fluid">
                    <LoginRecoveryCodeInput code={totp} setCode={loading ? noop : setTotp} id="recoveryCode" />
                </div>
            </div>
        );

        return (
            <Layout title={c('Title').t`Two-factor authentication`} left={<BackButton onClick={handleCancel} />}>
                <form name="totpForm" className="signup-form" onSubmit={handleSubmit} autoComplete="off">
                    {isTotpRecovery ? recoveryForm : totpForm}
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
            </Layout>
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
        const unlockInput = (
            <div className="flex onmobile-flex-column signup-label-field-container mb0-5">
                <Label htmlFor="password" className="mr1">{c('Label').t`Mailbox password`}</Label>
                <div className="flex-item-fluid">
                    <LoginUnlockInput
                        password={keyPassword}
                        setPassword={loading ? noop : setKeyPassword}
                        id="password"
                    />
                </div>
            </div>
        );
        return (
            <Layout title={c('Title').t`Unlock your mailbox`} left={<BackButton onClick={handleCancel} />}>
                <form name="unlockForm" className="signup-form" onSubmit={handleSubmit}>
                    {unlockInput}
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
            </Layout>
        );
    }

    if (form === FORM.U2F) {
        throw new Error('U2F not implemented');
    }

    throw new Error('Unsupported form');
};

export default AccountLoginContainer;
