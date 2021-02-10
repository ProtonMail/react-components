import React, { useEffect, useState } from 'react';
import { c } from 'ttag';
import { getCookie, setCookie } from 'proton-shared/lib/helpers/cookies';

import { Alert, FakeSelectChangeEvent, Field, Label, Option, Row, SelectTwo, Toggle } from '../../components';
import { useModals } from '../../hooks';
import EarlyAccessSwitchModal, { Environment } from './EarlyAccessSwitchModal';

const EarlyAccessSection = () => {
    const [environment, setEnvironment] = useState(getCookie('Version') as Environment | undefined);

    const { createModal } = useModals();

    const confirmEnvironmentSwitch = (env: Environment) => {
        return new Promise<void>((resolve, reject) => {
            if (env === 'default') {
                resolve();
                return;
            }

            createModal(<EarlyAccessSwitchModal environment={env} onConfirm={resolve} onCancel={reject} />);
        });
    };

    const handleToggleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const env = e.target.checked ? 'beta' : 'default';
        await confirmEnvironmentSwitch(env);
        setEnvironment(env);
        window.location.reload();
    };

    const handleSelectChange = async ({ value }: FakeSelectChangeEvent<Environment>) => {
        await confirmEnvironmentSwitch(value);
        setEnvironment(value);
        window.location.reload();
    };

    useEffect(() => {
        const expiry = new Date(2147483647000);

        setCookie({
            cookieName: 'Version',
            cookieValue: environment,
            cookieDomain: window.location.hostname,
            expirationDate: expiry.toUTCString(),
        });
    }, [environment]);

    const hasAlphaAccess = true;

    return (
        <>
            <Row>
                <Label htmlFor="remoteToggle">
                    {hasAlphaAccess ? (
                        <span className="mr0-5">{c('Label').t`Application Version`}</span>
                    ) : (
                        <span className="mr0-5">{c('Label').t`Beta Program Opt-In`}</span>
                    )}
                </Label>
                <Field>
                    {hasAlphaAccess ? (
                        <SelectTwo onChange={handleSelectChange} value={environment}>
                            <Option value="default" title={c('Environment').t`Live (Default)`} />
                            <Option value="beta" title={c('Environment').t`Beta`} />
                            <Option value="alpha" title={c('Environment').t`Alpha`} />
                        </SelectTwo>
                    ) : (
                        <Toggle checked={environment === 'beta'} onChange={handleToggleChange} />
                    )}
                </Field>
            </Row>
            <Alert>
                {hasAlphaAccess
                    ? c('Info')
                          .t`Participating in early access programs gives you the opportunity to test new features and improvements before they get released to the general public. It offers a chance to have an active role in shaping the quality of our services.`
                    : c('Info')
                          .t`Participating in beta programs gives you the opportunity to test new features and improvements before they get released to the general public. It offers a chance to have an active role in shaping the quality of our services.`}
            </Alert>
        </>
    );
};

export default EarlyAccessSection;
