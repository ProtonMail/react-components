import React from 'react';
import { c } from 'ttag';

import { Input, Label } from '../..';

interface Props {
    totp: string;
    setTotp: (newTotp: string) => void;
}

const TOTPForm = ({ totp, setTotp }: Props) => {
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
                    placeholder="123456"
                    onChange={({ target: { value } }) => setTotp(value)}
                    data-cy-login="TOTP"
                />
            </div>
        </div>
    );
};

export default TOTPForm;
