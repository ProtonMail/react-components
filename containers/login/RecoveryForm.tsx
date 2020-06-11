import React from 'react';
import { c } from 'ttag';

import { Label, Input } from '../..';

interface Props {
    code: string;
    setCode: (newCode: string) => void;
}

const RecoveryForm = ({ code, setCode }: Props) => {
    return (
        <div className="flex onmobile-flex-column signup-label-field-container mb0-5">
            <Label htmlFor="recoveryCode">{c('Label').t`Recovery code`}</Label>
            <div className="flex-item-fluid">
                <Input
                    type="text"
                    name="recoveryCode"
                    autoFocus
                    autoCapitalize="off"
                    autoCorrect="off"
                    id="recoveryCode"
                    required
                    value={code}
                    className="w100"
                    placeholder="123456"
                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setCode(value)}
                    data-cy-login="recoveryCode"
                />
            </div>
        </div>
    );
};

export default RecoveryForm;
