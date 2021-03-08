import React from 'react';
import { c } from 'ttag';
import { SETTINGS_PASSWORD_MODE } from 'proton-shared/lib/interfaces';

import { Field, Info, Label, Loader, PrimaryButton, Row, Toggle } from '../../components';
import { useAddresses, useModals, useUserSettings } from '../../hooks';

import ChangePasswordModal, { MODES } from './ChangePasswordModal';
import TwoFactorSection from './TwoFactorSection';

const PasswordsSection = () => {
    const [userSettings, loadingUserSettings] = useUserSettings();
    const [addresses, loadingAddresses] = useAddresses();
    const { createModal } = useModals();

    if (loadingUserSettings || loadingAddresses) {
        return <Loader />;
    }

    // VPN users are by default in two password mode, even if they don't have any addresses. Don't allow them to change two-password mode.
    const hasAddresses = Array.isArray(addresses) && addresses.length > 0;
    const isOnePasswordMode = userSettings?.Password?.Mode === SETTINGS_PASSWORD_MODE.ONE_PASSWORD_MODE;
    const passwordLabel = isOnePasswordMode ? c('Title').t`Password` : c('Title').t`Login password`;
    const passwordButtonLabel = isOnePasswordMode ? c('Title').t`Change password` : c('Title').t`Change login password`;

    const handleChangePassword = (mode: MODES) => {
        createModal(<ChangePasswordModal mode={mode} />);
    };

    return (
        <>
            <Row>
                <Label htmlFor="passwordChange">{passwordLabel}</Label>
                <Field>
                    <PrimaryButton
                        onClick={() =>
                            handleChangePassword(
                                isOnePasswordMode
                                    ? MODES.CHANGE_ONE_PASSWORD_MODE
                                    : MODES.CHANGE_TWO_PASSWORD_LOGIN_MODE
                            )
                        }
                    >
                        {passwordButtonLabel}
                    </PrimaryButton>
                </Field>
            </Row>
            {hasAddresses && (
                <>
                    <Row>
                        <Label htmlFor="passwordModeToggle">
                            <span className="mr0-5">{c('Label').t`Two password mode`}</span>
                            <Info url="https://protonmail.com/support/knowledge-base/single-password" />
                        </Label>
                        <Field>
                            <Toggle
                                loading={loadingUserSettings}
                                checked={!isOnePasswordMode}
                                id="passwordModeToggle"
                                onChange={() =>
                                    handleChangePassword(
                                        isOnePasswordMode ? MODES.SWITCH_TWO_PASSWORD : MODES.SWITCH_ONE_PASSWORD
                                    )
                                }
                            />
                        </Field>
                    </Row>
                    {!isOnePasswordMode && (
                        <Row>
                            <Label htmlFor="passwordModeToggle">
                                <span className="mr0-5">{c('Label').t`Mailbox password`}</span>
                                <Info url="https://protonmail.com/support/knowledge-base/single-password" />
                            </Label>
                            <Field>
                                <PrimaryButton
                                    onClick={() => handleChangePassword(MODES.CHANGE_TWO_PASSWORD_MAILBOX_MODE)}
                                >
                                    {c('Action').t`Change mailbox password`}
                                </PrimaryButton>
                            </Field>
                        </Row>
                    )}
                </>
            )}
            <TwoFactorSection />
        </>
    );
};

export default PasswordsSection;
