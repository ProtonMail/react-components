import React, { ChangeEvent, useEffect, useState, useMemo } from 'react';
import { c } from 'ttag';

import { ADDRESS_STATUS, RECEIVE_ADDRESS, SEND_ADDRESS } from 'proton-shared/lib/constants';
import { Address } from 'proton-shared/lib/interfaces';

import { Select, Loader, Info } from '../../components';
import { useAddresses, useMailSettings } from '../../hooks';

import { SettingsParagraph, SettingsSection } from '../account';

import PMSignature from './PMSignatureField';
import EditAddressesSection from './EditAddressesSection';
import SettingsLayout from '../account/SettingsLayout';
import SettingsLayoutRight from '../account/SettingsLayoutRight';
import SettingsLayoutLeft from '../account/SettingsLayoutLeft';

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
                    <SettingsLayout>
                        <SettingsLayoutLeft>
                            <label className="on-mobile-pb0 text-semibold w16r" htmlFor="addressSelector">
                                {c('Label').t`Email address`}
                            </label>
                        </SettingsLayoutLeft>
                        <SettingsLayoutRight className="on-mobile-pb0 flex flex-row flex-nowrap w100">
                            <Select id="addressSelector" options={options} onChange={handleChange} />
                        </SettingsLayoutRight>
                    </SettingsLayout>

                    {address && <EditAddressesSection address={address} />}

                    <SettingsLayout>
                        <SettingsLayoutLeft>
                            <label htmlFor="pmSignatureToggle" className="text-semibold w16r">
                                <span className="mr0-5">{c('Label').t`ProtonMail footer`}</span>
                                <Info title={c('Info').t`Let your contacts know you care about their privacy.`} />
                            </label>
                        </SettingsLayoutLeft>
                        <SettingsLayoutRight>
                            <PMSignature id="pmSignatureToggle" mailSettings={mailSettings} />
                        </SettingsLayoutRight>
                    </SettingsLayout>
                </>
            )}
        </SettingsSection>
    );
};

export default IdentitySection;
