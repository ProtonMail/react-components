import React, { ChangeEvent, useEffect, useState, useMemo } from 'react';
import { c } from 'ttag';
import { ADDRESS_STATUS, RECEIVE_ADDRESS, SEND_ADDRESS } from 'proton-shared/lib/constants';
import { Address } from 'proton-shared/lib/interfaces';

import { Alert, /* Button, */ Label, Select, /* Info, */ Field, Loader, Row } from '../../components';
import { useAddresses, /* useModals, */ useMailSettings } from '../../hooks';

import SettingsSection from '../account/SettingsSection';
import SettingsParagraph from '../account/SettingsParagraph';

/* import EditAddressModal from './EditAddressModal';
 */ import PMSignatureField from './PMSignatureField';
import EditAddressesSection from './EditAddressesSection';

const IdentitySection = () => {
    const [addresses = [], loading] = useAddresses();

    const [mailSettings] = useMailSettings();
    const showPMSignatureWarning = mailSettings?.PMSignature === 2;

    const [address, setAddress] = useState<Address>();

    const filtered = useMemo(
        () =>
            addresses.filter(
                ({ Status, Receive, Send }) =>
                    Status === ADDRESS_STATUS.STATUS_ENABLED &&
                    Receive === RECEIVE_ADDRESS.RECEIVE_YES &&
                    Send === SEND_ADDRESS.SEND_YES
            ),
        [addresses]
    );

    useEffect(() => {
        if (!address && filtered.length) {
            setAddress(filtered[0]);
        }
    }, [address, filtered]);

    if (loading && !addresses.length) {
        return <Loader />;
    }

    const options = filtered.map(({ Email: text }, index) => ({ text, value: index }));

    const handleChange = ({ target }: ChangeEvent<HTMLSelectElement>) => setAddress(filtered[+target.value]);

    if (!filtered.length || !address) {
        return <Alert>{c('Info').t`No addresses exist`}</Alert>;
    }

    return (
        <SettingsSection className="pr3">
            <SettingsParagraph learnMoreUrl="https://protonmail.com/support/knowledge-base/display-name-and-signature/">
                {c('Info')
                    .t`Click the Edit button to personalize your email address. Your Display Name appears in the From field when people receive an email from you. Your Signature is appended at the bottom of your messages. Or leave each field empty for more privacy.`}
            </SettingsParagraph>

            <Row>
                <Label className="on-mobile-pb0 text-bold w16r" htmlFor="addressSelector">
                    {c('Label').t`Select an address`}
                </Label>
                <Field className="on-mobile-pb0 flex flex-row flex-nowrap w100">
                    <Select id="addressSelector" options={options} onChange={handleChange} />
                </Field>
            </Row>

            <EditAddressesSection address={address} />

            {showPMSignatureWarning && (
                <Alert>{c('Info')
                    .t`A paid plan is required to turn off the ProtonMail signature. Paid plan revenue allows us to continue supporting free accounts.`}</Alert>
            )}
            <Row>
                <Label htmlFor="pmSignatureToggle" className="text-bold w16r">{c('Label')
                    .t`ProtonMail signature`}</Label>
                <PMSignatureField id="pmSignatureToggle" mailSettings={mailSettings} />
            </Row>
        </SettingsSection>
    );
};

export default IdentitySection;
