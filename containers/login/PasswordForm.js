import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Input, Label, PasswordInput, SupportDropdown } from 'react-components';
import { EMAIL_PLACEHOLDER, PASSWORD_PLACEHOLDER } from 'proton-shared/lib/constants';

const PasswordForm = ({ username, setUsername, password, setPassword }) => {
    return (
        <>
            <div className="flex onmobile-flex-column mb1">
                <Label htmlFor="login">{c('Label').t`Email / Username`}</Label>
                <div className="flex-item-fluid">
                    <Input
                        type="text"
                        name="login"
                        autoFocus
                        autoCapitalize="off"
                        autoCorrect="off"
                        id="login"
                        required
                        value={username}
                        placeholder={EMAIL_PLACEHOLDER}
                        onChange={({ target: { value } }) => setUsername(value)}
                        data-cy-login="username"
                    />
                </div>
            </div>
            <div className="flex onmobile-flex-column mb2">
                <Label htmlFor="password">{c('Label').t`Password`}</Label>
                <div className="flex-item-fluid">
                    <div className="mb0-5">
                        <PasswordInput
                            name="password"
                            autoComplete="current-password"
                            id="password"
                            required
                            value={password}
                            placeholder={PASSWORD_PLACEHOLDER}
                            onChange={({ target: { value } }) => setPassword(value)}
                            data-cy-login="password"
                        />
                    </div>
                    <SupportDropdown content={c('Action').t`Need help?`} className="link" />
                </div>
            </div>
        </>
    );
};

PasswordForm.propTypes = {
    username: PropTypes.string,
    password: PropTypes.string,
    setUsername: PropTypes.func,
    setPassword: PropTypes.func
};

export default PasswordForm;
