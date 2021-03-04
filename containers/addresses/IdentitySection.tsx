import React, { ChangeEvent, useEffect, useState, useMemo } from 'react';
import { c } from 'ttag';

import { ADDRESS_STATUS, RECEIVE_ADDRESS, SEND_ADDRESS } from 'proton-shared/lib/constants';
import { Address } from 'proton-shared/lib/interfaces';

import { Label, Select, Field, Loader, Row } from '../../components';
import { useAddresses, useMailSettings } from '../../hooks';

import { SettingsParagraph, SettingsSection } from '../account';

import PMSignatureField from './PMSignatureField';
import EditAddressesSection from './EditAddressesSection';

const IdentitySection = () => {
    const [addresses, loading] = useAddresses();

    const [mailSettings] = useMailSettings();

    const [address, setAddress] = useState<Address>();

    const filtered = useMemo<Address[]>(() => {
        return addresses
            ? addresses.filter(
                  ({ Status, Receive, Send }) =>
                      Status === ADDRESS_STATUS.STATUS_ENABLED &&
                      Receive === RECEIVE_ADDRESS.RECEIVE_YES &&
                      Send === SEND_ADDRESS.SEND_YES
              )
            : [];
    }, [addresses]);

    useEffect(() => {
        if (!address && filtered.length) {
            setAddress(filtered[0]);
        }
    }, [address, filtered]);

    if (!loading && !filtered.length) {
        return <SettingsParagraph>{c('Info').t`No addresses exist`}</SettingsParagraph>;
    }

    const options = filtered.map(({ Email: text }, index) => ({ text, value: index }));

    const handleChange = ({ target }: ChangeEvent<HTMLSelectElement>) => {
        if (filtered) {
            setAddress(filtered[+target.value]);
        }
    };

    return (
        <SettingsSection className="no-scroll">
            {loading || !Array.isArray(addresses) ? (
                <Loader />
            ) : (
                <>
                    <SettingsParagraph learnMoreUrl="https://protonmail.com/support/knowledge-base/display-name-and-signature/">
                        {c('Info')
                            .t`Click the Edit button to personalize your email address. Your Display Name appears in the From field when people receive an email from you. Your Signature is appended at the bottom of your messages. Or leave each field empty for more privacy.`}
                    </SettingsParagraph>

                    <Row>
                        <Label className="on-mobile-pb0 text-semibold w16r" htmlFor="addressSelector">
                            {c('Label').t`Select an address`}
                        </Label>
                        <Field className="on-mobile-pb0 flex flex-row flex-nowrap w100">
                            <Select id="addressSelector" options={options} onChange={handleChange} />
                        </Field>
                    </Row>

                    {address && <EditAddressesSection address={address} />}

                    <Row>
                        <Label htmlFor="pmSignatureToggle" className="text-semibold w16r">{c('Label')
                            .t`ProtonMail footer`}</Label>
                        <PMSignatureField id="pmSignatureToggle" mailSettings={mailSettings} />
                    </Row>
                </>
            )}
        </SettingsSection>
    );
};

export default IdentitySection;
