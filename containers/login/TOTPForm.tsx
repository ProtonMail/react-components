import React, { ChangeEvent } from 'react';
import { c } from 'ttag';
import { Input, Label } from 'react-components';

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
                    placeholder={c('Placeholder').t`Two-factor code`}
                    onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => setTotp(value)}
                    data-cy-login="TOTP"
                />
            </div>
        </div>
    );
};

export default TOTPForm;
