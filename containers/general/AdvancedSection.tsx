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
    MailShortcutsModal,
    Button,
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
                <Label htmlFor="shortcutsToggle" className="text-semibold">
                    {c('Title').t`Enable keyboard shortcuts`}
                </Label>
                <Field className="flex flex-item-fluid flex-justify-space-between">
                    <ShortcutsToggle
                        className="mr1"
                        id="shortcutsToggle"
                        shortcuts={shortcuts}
                        onChange={handleShortcutsToggleChange}
                    />
                    <Button
                        shape="outline"
                        onClick={openShortcutsModal}
                        className="flex-item-noshrink flex-item-nogrow"
                    >
                        {c('Action').t`Show shortcuts`}
                    </Button>
                </Field>
            </Row>

            <Row>
                <Label htmlFor="betaToggle" className="text-semibold">
                    {hasAlphaAccess ? (
                        <span className="mr0-5">{c('Label').t`Application Version`}</span>
                    ) : (
                        <>
                            <span className="mr0-5">{c('Label').t`Join the beta program`}</span>
                            <Info
                                title={c('Info')
                                    .t`ProtonMail beta testers get early access to new features and take part in the development of our products.`}
                            />
                        </>
                    )}
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
