import React, { useState } from 'react';
import {
    Button,
    SubTitle,
    Alert,
    Row,
    Field,
    Label,
    Copy,
    PrimaryButton,
    useUserVPN,
    useModals
} from 'react-components';
import { c } from 'ttag';

import OpenVPNCredentialsModal from './OpenVPNCredentialsModal';

const OpenVPNAccountSection = () => {
    const { createModal } = useModals();
    const { result = {}, fetch: fetchUserVPN } = useUserVPN();
    const { VPN = {} } = result;
    const { Name = '', Password = '' } = VPN;
    const [show, setShow] = useState(false);

    const handleEditCredentials = () => {
        createModal(<OpenVPNCredentialsModal username={Name} password={Password} fetchUserVPN={fetchUserVPN} />);
    };

    return (
        <>
            <SubTitle>{c('Title').t`OpenVPN / IKEv2 username`}</SubTitle>
            <Alert learnMore="https://protonvpn.com/support/vpn-login/">
                {c('Info')
                    .t`Use the following credentials when connecting to ProtonVPN servers without application. Examples use cases include: Tunnelblick on MacOS, OpenVPN on GNU/Linux.
                    Do not use the OpenVPN / IKEv2 credentials in ProtonVPN applications or on the ProtonVPN dashboard.`}
            </Alert>
            <Row>
                <Label>{c('Label').t`OpenVPN / IKEv2 username`}</Label>
                <Field>
                    <div className="pt0-5">
                        <code>{Name}</code>
                    </div>
                </Field>
                <div className="ml1 flex-item-noshrink onmobile-ml0 onmobile-mt0-5">
                    <Copy value={Name} />
                </div>
            </Row>
            <Row>
                <Label>{c('Label').t`OpenVPN / IKEv2 password`}</Label>
                <Field>
                    <div className="mb1 pt0-5">
                        <code>{show ? Password : '••••••••••••••••••••'}</code>
                    </div>
                    <PrimaryButton disabled={!Name || !Password} onClick={handleEditCredentials}>{c('Action')
                        .t`Edit credentials`}</PrimaryButton>
                </Field>
                <div className="ml1 flex-item-noshrink onmobile-ml0 onmobile-mt0-5">
                    <Copy value={Password} />
                    <Button
                        icon={show ? 'unread' : 'read'}
                        onClick={() => setShow(!show)}
                        title={show ? c('Action').t`Hide` : c('Action').t`Show`}
                    />
                </div>
            </Row>
        </>
    );
};

export default OpenVPNAccountSection;
