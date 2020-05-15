import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Input, Label } from 'react-components';

const UnlockForm = ({ password, setPassword }) => {
    return (
        <div className="flex onmobile-flex-column mb1">
            <Label htmlFor="password" className="mr1">{c('Label').t`Mailbox password`}</Label>
            <div className="flex-item-fluid">
                <Input
                    type="password"
                    name="password"
                    autoFocus
                    autoCapitalize="off"
                    autoCorrect="off"
                    id="password"
                    required
                    className="w100 mb1"
                    value={password}
                    placeholder={c('Placeholder').t`Mailbox password`}
                    onChange={({ target: { value } }) => setPassword(value)}
                    data-cy-login="mailbox password"
                />
            </div>
        </div>
    );
};

UnlockForm.propTypes = {
    password: PropTypes.string,
    setPassword: PropTypes.func
};

export default UnlockForm;
