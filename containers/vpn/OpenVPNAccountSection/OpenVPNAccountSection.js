import React, { useState, useEffect } from 'react';
import {
    SubTitle,
    Alert,
    Row,
    Field,
    Input,
    Label,
    Copy,
    PrimaryButton,
    PasswordInput,
    useUserVPN
} from 'react-components';
import { c } from 'ttag';
import useApiWithoutResult from '../../../hooks/useApiWithoutResult';
import { updateVPNName, updateVPNPassword } from 'proton-shared/lib/api/vpn';
import useNotifications from '../../notifications/useNotifications';

const OpenVPNAccountSection = () => {
    const { createNotification } = useNotifications();
    const { result, fetch: fetchUserVPN } = useUserVPN();
    const [credentials, setCredentials] = useState({});
    const { loading: loadingUsername, request: updateUsername } = useApiWithoutResult(updateVPNName);
    const { loading: loadingPassword, request: updatePassword } = useApiWithoutResult(updateVPNPassword);

    // VPN Info might not have been loaded yet
    useEffect(() => {
        if (result && result.VPN) {
            setCredentials({
                username: result.VPN.Name,
                password: result.VPN.Password
            });
        }
    }, [result]);

    const { username, password } = credentials;

    const handleChangeUsername = ({ target }) => setCredentials((prev) => ({ ...prev, username: target.value }));
    const handleChangePassword = ({ target }) => setCredentials((prev) => ({ ...prev, password: target.value }));

    const handleUpdateUsername = async () => {
        await updateUsername(credentials.username);
        createNotification({ text: c('Notification').t`OpenVPN username updated` });
        fetchUserVPN();
    };
    const handleUpdatePassword = async () => {
        await updatePassword(credentials.password);
        createNotification({ text: c('Notification').t`OpenVPN password updated` });
        fetchUserVPN();
    };

    return (
        <>
            <SubTitle>{c('Title').t`OpenVPN / IKEv2 Username`}</SubTitle>
            <Alert learnMore="https://protonvpn.com/support/vpn-login/">
                {c('Info')
                    .t`Use the following credentials when connecting to ProtonVPN servers without application. Examples use cases include: Tunnelblick on MacOS, OpenVPN on GNU/Linux.
                    Do not use the OpenVPN / IKEv2 credentials in ProtonVPN applications or on the ProtonVPN dashboard.`}
            </Alert>
            <Row>
                <Label htmlFor="openvpn-username">{c('Label').t`OpenVPN / IKEv2 Username`}</Label>
                <Field>
                    <Input id="openvpn-username" value={username} onChange={handleChangeUsername} />
                    <Row className="mt1">
                        <Copy className="mr1" value={username} />
                        <PrimaryButton
                            disabled={!credentials || !credentials.username}
                            loading={loadingUsername}
                            onClick={handleUpdateUsername}
                        >{c('Action').t`Change Username`}</PrimaryButton>
                    </Row>
                </Field>
            </Row>
            <Row>
                <Label htmlFor="openvpn-password">{c('Label').t`OpenVPN / IKEv2 Password`}</Label>
                <Field>
                    <PasswordInput id="openvpn-password" value={password} onChange={handleChangePassword} />
                    <Row className="mt1">
                        <Copy className="mr1" value={password} />
                        <PrimaryButton
                            disabled={!credentials || !credentials.password}
                            loading={loadingPassword}
                            onClick={handleUpdatePassword}
                        >{c('Action').t`Change Password`}</PrimaryButton>
                    </Row>
                </Field>
            </Row>
        </>
    );
};

export default OpenVPNAccountSection;
