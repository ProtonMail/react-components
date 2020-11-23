import React, { useState } from 'react';
import { c } from 'ttag';
import { getHasTOTPSettingEnabled } from 'proton-shared/lib/settings/twoFactor';
import { FormModal } from '../../components';
import { useUserSettings } from '../../hooks';
import PasswordTotpInputs from './PasswordTotpInputs';

interface Props {
    onClose?: () => void;
    onSubmit: (data: { password: string; totp: string }) => void;
    error: string;

    [key: string]: any;
}

const AskAuthModal = ({ onClose, onSubmit, error, ...rest }: Props) => {
    const [password, setPassword] = useState('');
    const [totp, setTotp] = useState('');
    const [userSettings] = useUserSettings();

    const hasTOTPEnabled = getHasTOTPSettingEnabled(userSettings);

    return (
        <FormModal
            onClose={onClose}
            onSubmit={() => onSubmit({ password, totp })}
            title={c('Title').t`Sign in again to continue`}
            close={c('Label').t`Cancel`}
            submit={c('Label').t`Submit`}
            error={error}
            small
            {...rest}
        >
            <PasswordTotpInputs
                password={password}
                setPassword={setPassword}
                passwordError={error}
                totp={totp}
                setTotp={setTotp}
                totpError={error}
                showTotp={hasTOTPEnabled}
            />
        </FormModal>
    );
};

export default AskAuthModal;
