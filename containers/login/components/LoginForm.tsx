import { c } from 'ttag';
import React from 'react';
import { noop } from 'proton-shared/lib/helpers/function';

import AccountSupportDropdown from '../../heading/AccountSupportDropdown';
import SignupSubmitRow from '../../signup/SignupSubmitRow';
import { PrimaryButton, Label } from '../../../components';
import SignupLabelInputRow from '../../signup/SignupLabelInputRow';
import LoginUsernameInput from '../LoginUsernameInput';
import LoginPasswordInput from '../LoginPasswordInput';
import { LoginErrors, LoginModel } from '../interface';

interface Props {
    state: LoginModel;
    errors: LoginErrors;
    setters:
}
const LoginForm = ({ state, errors, setters }: Props) => {
    const usernameInput = (
        <SignupLabelInputRow
            label={<Label htmlFor="login">{c('Label').t`Email or Username`}</Label>}
            input={<LoginUsernameInput id="login" username={username} setUsername={loading ? noop : setUsername} />}
        />
    );

    const passwordInput = (
        <SignupLabelInputRow
            label={<Label htmlFor="password">{c('Label').t`Password`}</Label>}
            input={
                <LoginPasswordInput id="password" password={password} setPassword={loading ? noop : setPassword} />
            }
        />
    );

    return (
        <form name="loginForm" className="signup-form" onSubmit={handleSubmit}>
            {usernameInput}
            {passwordInput}
            <div className="mb1">
                <AccountSupportDropdown noCaret className="link">
                    {c('Action').t`Need help?`}
                </AccountSupportDropdown>
            </div>
            <SignupSubmitRow>
                <PrimaryButton
                    type="submit"
                    className="pm-button--large"
                    loading={loading}
                    data-cy-login="submit"
                >
                    {c('Action').t`Sign in`}
                </PrimaryButton>
            </SignupSubmitRow>
        </form>
    )
};

export default LoginForm;
