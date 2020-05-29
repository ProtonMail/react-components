import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { EmailInput, Alert, PrimaryButton, Label } from 'react-components';

const ForgotUsernameForm = ({ onSubmit, loading }) => {
    const [email, updateEmail] = useState('');

    return (
        <form
            className="signup-form"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(email);
            }}
        >
            <Alert>{c('Info')
                .t`Enter your recovery email address, and we'll send you your username(s). (This is usually the email address you provided during signup.)`}</Alert>
            <div className="flex onmobile-flex-column mb2">
                <Label htmlFor="email">{c('Label').t`Recovery email`}</Label>
                <div className="flex-item-fluid">
                    <EmailInput
                        name="email"
                        autoFocus
                        autoCapitalize="off"
                        autoCorrect="off"
                        id="email"
                        value={email}
                        onChange={({ target }) => updateEmail(target.value)}
                        required
                    />
                </div>
            </div>
            <div className="flex flex-nowrap flex-justify-end mb1">
                <PrimaryButton className="pm-button--large onmobile-w100" loading={loading} type="submit">{c('Action')
                    .t`Email me my username(s)`}</PrimaryButton>
            </div>
        </form>
    );
};

ForgotUsernameForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool
};

export default ForgotUsernameForm;
