import React, { ChangeEvent, useState } from 'react';
import { c } from 'ttag';

import { KT_STATUS } from 'key-transparency-web-client';
import { APPS } from 'proton-shared/lib/constants';
import FormModal from '../../../components/modal/FormModal';
import { useAddresses } from '../../../hooks';
import useKeyTransparency from '../useKeyTransparency';
import KTKeysTable from './KTKeysTable';
import { Info, useAppLink } from '../../../components/link';
import { Alert } from '../../../components/alert';
import { Paragraph } from '../../../components/paragraph';
import { Block } from '../../../components/container';
import { Select } from '../../../components/select';

const KTModalSelf = ({ ...rest }) => {
    const keyTransparencyState = useKeyTransparency();
    const [Addresses] = useAddresses();

    let startingIndex = 0;
    for (let index = 0; index < Addresses.length; index++) {
        const ktSelfAuditResult = keyTransparencyState.ktSelfAuditResult.get(Addresses[index].ID);
        if (ktSelfAuditResult?.code !== KT_STATUS.KT_PASSED) {
            startingIndex = index;
            break;
        }
    }

    const [addressIndex, setAddressIndex] = useState(() => (Array.isArray(Addresses) ? startingIndex : -1));
    const [loadingKeyID] = useState<string>('');
    const goToApp = useAppLink();

    const { onClose } = rest;
    const Address = Addresses[addressIndex];
    const isLoadingKey = loadingKeyID !== '';
    const dateLastSelfAudit = new Date(keyTransparencyState.lastSelfAudit);
    const ktSelfAuditResult = keyTransparencyState.ktSelfAuditResult.get(Address.ID);

    const topParagraph = c('Info').t`Messages you receive will be encrypted using the keys below.`;
    const bottomParagraph =
        ktSelfAuditResult?.code === KT_STATUS.KT_PASSED
            ? c('Info').t`We verified that the above public keys are in Key Transparency.
            This means that other ProtonMail users sending emails to you will also use these public keys.
            This makes sure that nobody else can read those emails.`
            : c('Info').t`We couldn't verify that the above public keys are in Key Transparency.
            This means that other ProtonMail users sending emails to you might be using other public keys.
            This means that those emails might not be securely encrypted.`;
    const errorParagraph = `[${dateLastSelfAudit.toUTCString()}] ${ktSelfAuditResult?.error}`;
    const alertKT = ktSelfAuditResult?.code === KT_STATUS.KT_PASSED ? 'success' : 'error';

    const handleSubmit = () => {
        goToApp('/settings/security#addresses', APPS.PROTONMAIL);
        onClose();
    };

    return (
        <FormModal
            title={c(`Title`).t`Encryption details`}
            submit={c('Action').t`Settings`}
            onSubmit={handleSubmit}
            close={c('Action').t`Close`}
            {...rest}
        >
            <Alert type="info" learnMore="https://protonmail.com/support/knowledge-base/how-to-use-pgp/">
                {topParagraph}
            </Alert>
            <Paragraph>
                {c('Label').t`Public keys`}
                <Info
                    className="ml0-5"
                    title={c('Tooltip').t`Public keys are used to send end-to-end encrypted emails to this address`}
                />
            </Paragraph>
            {Addresses.length > 1 && (
                <Block>
                    <Select
                        value={addressIndex}
                        options={Addresses.map(({ Email }, i) => ({ text: Email, value: i }))}
                        onChange={({ target: { value } }: ChangeEvent<HTMLSelectElement>) =>
                            !isLoadingKey && setAddressIndex(+value)
                        }
                    />
                </Block>
            )}
            <KTKeysTable emailAddress={Address.Email} />
            <Alert type={alertKT} learnMore="https://protonmail.com/support/knowledge-base/key-transparency/">
                <div>{bottomParagraph}</div>
                <div>{errorParagraph}</div>
            </Alert>
        </FormModal>
    );
};

export default KTModalSelf;
