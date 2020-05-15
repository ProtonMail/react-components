import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Input, Label } from 'react-components';

const TOTPForm = ({ totp, setTotp }) => {
    return (
        <div className="flex onmobile-flex-column mb1">
            <Label htmlFor="twoFa">{c('Label').t`Two-factor code`}</Label>
            <div className="flex-item-fluid">
                <Input
                    type="text"
                    name="twoFa"
                    autoFocus
                    autoCapitalize="off"
                    autoCorrect="off"
                    id="twoFa"
                    required
                    value={totp}
                    className="w100 mb1"
                    placeholder={c('Placeholder').t`Two-factor code`}
                    onChange={({ target: { value } }) => setTotp(value)}
                    data-cy-login="TOTP"
                />
            </div>
        </div>
    );
};

TOTPForm.propTypes = {
    totp: PropTypes.string,
    setTotp: PropTypes.func
};

export default TOTPForm;
