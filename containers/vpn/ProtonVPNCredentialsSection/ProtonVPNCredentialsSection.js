import React from 'react';
import { SubTitle, Row, Label, Field, Alert, Href } from 'react-components';
import { c } from 'ttag';
import useUser from '../../../hooks/useUser';
import useAddresses from '../../../hooks/useAddresses';
import { isMember } from 'proton-shared/lib/user/helpers';

const ProtonVPNCredentialsSection = () => {
    const [user] = useUser();
    const [addresses] = useAddresses();

    const getFirstEmail = ([{ Email = '' } = {}] = []) => Email;
    const username = isMember(user) ? getFirstEmail(addresses) : user.Name;

    return (
        <>
            <SubTitle>{c('Title').t`ProtonVPN Credentials`}</SubTitle>
            <Alert>
                Use the following credentials to log into the{' '}
                <Href url="https://protonvpn.com/download">ProtonVPN native clients.</Href>
            </Alert>
            <Row>
                <Label>{c('Label').t`Proton Username`}</Label>
                <Field className="mt0-5">
                    <strong>{username}</strong>
                </Field>
            </Row>
            <Row>
                <Label>{c('Label').t`Password`}</Label>
                <Field className="mt0-5">
                    <strong>{c('Info').t`Same as ProtonMail login password`}</strong>
                </Field>
            </Row>
        </>
    );
};

export default ProtonVPNCredentialsSection;
