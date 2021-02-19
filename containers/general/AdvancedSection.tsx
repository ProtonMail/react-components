import React, { useState, useEffect } from 'react';
import { c } from 'ttag';

import { getCookie, setCookie } from 'proton-shared/lib/helpers/cookies';

import {
    Info,
    FakeSelectChangeEvent,
    Field,
    Label,
    Option,
    Row,
    SelectTwo,
    Toggle,
    SmallButton,
    MailShortcutsModal,
} from '../../components';
import { useEarlyAccess, useModals, useMailSettings } from '../../hooks';
import { SettingsSection } from '../account';

import EarlyAccessSwitchModal, { Environment } from './EarlyAccessSwitchModal';
import ShortcutsToggle from './ShortcutsToggle';

const AdvancedSection = () => {
    const { createModal } = useModals();

    const [{ Shortcuts = 1 } = {}] = useMailSettings();
    const [shortcuts, setShortcuts] = useState(Shortcuts);
    const [environment, setEnvironment] = useState(() => (getCookie('Version') || 'prod') as Environment);

    const { hasAlphaAccess } = useEarlyAccess();

    const confirmEnvironmentSwitch = (toEnvironment: Environment) => {
        return new Promise<void>((resolve, reject) => {
            createModal(
                <EarlyAccessSwitchModal
                    fromEnvironment={environment}
                    toEnvironment={toEnvironment}
                    onConfirm={resolve}
                    onCancel={reject}
                />
            );
        });
    };

    const updateVersionCookie = (env: Environment) => {
        if (['alpha', 'beta'].includes(env)) {
            setCookie({
                cookieName: 'Version',
                cookieValue: env,
                expirationDate: 'max',
                path: '/',
            });
        } else {
            setCookie({
                cookieName: 'Version',
                cookieValue: undefined,
                path: '/',
            });
        }
    };

    const handleToggleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const env = e.target.checked ? 'beta' : 'prod';
        await confirmEnvironmentSwitch(env);
        setEnvironment(env);
        updateVersionCookie(env);
        window.location.reload();
    };

    const handleSelectChange = async ({ value }: FakeSelectChangeEvent<Environment>) => {
        await confirmEnvironmentSwitch(value);
        setEnvironment(value);
        updateVersionCookie(value);
        window.location.reload();
    };

    const openShortcutsModal = () => {
        createModal(<MailShortcutsModal />, 'shortcuts-modal');
    };

    const handleShortcutsToggleChange = (newValue: number) => setShortcuts(newValue);

    // Handle updates from the Event Manager.
    useEffect(() => {
        setShortcuts(Shortcuts);
    }, [Shortcuts]);

    return (
        <SettingsSection>
            <Row>
                <Label htmlFor="shortcutsToggle" className="text-bold">
                    {c('Title').t`Keyboard shortcuts`}
                </Label>
                <Field className="flex flex-item-fluid flex-justify-space-between">
                    <ShortcutsToggle
                        className="mr1"
                        id="shortcutsToggle"
                        shortcuts={shortcuts}
                        onChange={handleShortcutsToggleChange}
                    />
                    <SmallButton onClick={openShortcutsModal} className="flex-item-noshrink flex-item-nogrow">
                        {c('Action').t`Display keyboard shortcuts`}
                    </SmallButton>
                </Field>
            </Row>

            <Row>
                <Label htmlFor="betaToggle" className="text-bold">
                    {hasAlphaAccess ? (
                        <span className="mr0-5">{c('Label').t`Application Version`}</span>
                    ) : (
                        <span className="mr0-5">{c('Label').t`Beta Program Opt-In`}</span>
                    )}
                    <Info
                        title={
                            hasAlphaAccess
                                ? c('Info')
                                      .t`Participating in early access programs gives you the opportunity to test new features and improvements before they get released to the general public. It offers a chance to have an active role in shaping the quality of our services.`
                                : c('Info')
                                      .t`Participating in beta programs gives you the opportunity to test new features and improvements before they get released to the general public. It offers a chance to have an active role in shaping the quality of our services.`
                        }
                    />
                </Label>
                <Field>
                    {hasAlphaAccess ? (
                        <SelectTwo onChange={handleSelectChange} value={environment}>
                            <Option value="prod" title={c('Environment').t`Live (Default)`} />
                            <Option value="beta" title={c('Environment').t`Beta`} />
                            <Option value="alpha" title={c('Environment').t`Alpha`} />
                        </SelectTwo>
                    ) : (
                        <Toggle id="betaToggle" checked={environment === 'beta'} onChange={handleToggleChange} />
                    )}
                </Field>
            </Row>
        </SettingsSection>
    );
};

export default AdvancedSection;
