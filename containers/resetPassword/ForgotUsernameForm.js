import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { EmailInput, PrimaryButton, Label } from 'react-components';

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
            <p>{c('Info')
                .t`Enter your recovery email address or recovery phone number and we will send you your username or email address.`}</p>
            <div className="flex onmobile-flex-column signup-label-field-container mb2">
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
                <PrimaryButton
                    className="pm-button--large onmobile-w100"
                    disabled={!email}
                    loading={loading}
                    type="submit"
                >{c('Action').t`Send my username`}</PrimaryButton>
            </div>
        </form>
    );
};

ForgotUsernameForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool
};

export default ForgotUsernameForm;
