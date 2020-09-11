import React from 'react';

import { Props as UseLoginProps } from './useLogin';
import { AccountPublicLayout } from '../signup';
import MinimalLogin from './MinimalLogin';
import { ProtonLogo, Row, Label, Field } from '../../components';
import { useConfig } from '../../hooks';

interface Props extends Omit<UseLoginProps, 'api'> {
    needHelp?: React.ReactNode;
}

const MinimalLoginContainer = ({ onLogin, ignoreUnlock = false, needHelp }: Props) => {
    const config = useConfig();

    // eslint-disable-next-line no-console
    console.log('Config:', { ...config /* Needed to force the use of the getters */ });

    return (
        <AccountPublicLayout
            center={<ProtonLogo className="fill-global-warning" />}
            title="Proton standalone login"
            subtitle={
                <>
                    <Row className="mt1">
                        <Label>APP_NAME</Label>
                        <Field>{config.APP_NAME}</Field>
                    </Row>
                    <Row>
                        <Label>API_URL</Label>
                        <Field>{config.API_URL}</Field>
                    </Row>
                    <Row className="placeholder text-center">Full config in the console</Row>
                </>
            }
        >
            <MinimalLogin onLogin={onLogin} ignoreUnlock={ignoreUnlock} needHelp={needHelp} />
        </AccountPublicLayout>
    );
};

export default MinimalLoginContainer;
