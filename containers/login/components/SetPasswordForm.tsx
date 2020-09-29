import { c } from 'ttag';
import React, { ChangeEvent } from 'react';

import SignupSubmitRow from '../../signup/SignupSubmitRow';
import { Label, PasswordInput, PrimaryButton } from '../../../components';
import SignupLabelInputRow from '../../signup/SignupLabelInputRow';

interface Props {
}
const SetPasswordForm = ({ errors, state, setters }: Props) => {
    const newPasswordInput = (
        <SignupLabelInputRow
            label={<Label htmlFor="login">{c('Label').t`New password`}</Label>}
            input={
                <PasswordInput
                    id="password-repeat"
                    name="password-repeat"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    value={newPassword}
                    onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                        setNewPassword(target.value)
                    }
                    error={errors.newPassword}
                    required
                />
            }
        />
    );

    const confirmNewPasswordInput = (
        <SignupLabelInputRow
            label={<Label htmlFor="password">{c('Label').t`Confirm password`}</Label>}
            input={
                <PasswordInput
                    id="password-repeat"
                    name="password-repeat"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    value={newPassword}
                    onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                        setNewPassword(target.value)
                    }
                    error={errors.confirmPassword}
                    required
                />
            }
        />
    );

    return (
        <form name="setPasswordForm" className="signup-form" onSubmit={handleSubmit}>
            {newPasswordInput}
            {confirmNewPasswordInput}
            <SignupSubmitRow>
                <PrimaryButton
                    type="submit"
                    className="pm-button--large"
                    loading={loading}
                    data-cy-login="submit"
                >
                    {c('Action').t`Confirm`}
                </PrimaryButton>
            </SignupSubmitRow>
        </form>
    )
}

export default SetPasswordForm;
