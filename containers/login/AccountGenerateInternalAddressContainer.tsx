import React, { FunctionComponent, useState, useEffect } from 'react';
import { c } from 'ttag';
import { APP_NAMES, DEFAULT_ENCRYPTION_CONFIG, ENCRYPTION_CONFIGS } from 'proton-shared/lib/constants';
import { queryCheckUsernameAvailability } from 'proton-shared/lib/api/user';
import { getApiErrorMessage } from 'proton-shared/lib/api/helpers/apiErrorHelper';
import { queryAvailableDomains } from 'proton-shared/lib/api/domains';
import { updateUsername } from 'proton-shared/lib/api/settings';
import { generateAddressKey } from 'proton-shared/lib/keys/keys';
import { Api } from 'proton-shared/lib/interfaces';

import { useNotifications } from '../../hooks';

import BackButton from '../signup/BackButton';
import { Props as AccountPublicLayoutProps } from '../signup/AccountPublicLayout';
import { getToAppName } from '../signup/helpers/helper';
import createKeyHelper from '../keys/addKey/createKeyHelper';
import handleSetupAddress from '../signup/helpers/handleSetupAddress';
import AccountGenerateInternalAddressForm from './components/AccountGenerateInternalAddressForm';

interface Props {
    Layout: FunctionComponent<AccountPublicLayoutProps>;
    externalEmailAddress: string;
    toApp?: APP_NAMES;
    onDone: () => Promise<void>;
    onBack: () => void;
    api: Api;
    keyPassword: string;
}
const AccountGenerateInternalAddressContainer = ({
    Layout,
    externalEmailAddress,
    toApp,
    onBack,
    onDone,
    api,
    keyPassword,
}: Props) => {
    const appName = getToAppName(toApp);

    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const { createNotification } = useNotifications();
    const [availableDomains, setAvailableDomains] = useState([]);

    const handleCreateAddressAndKey = async () => {
        if (!keyPassword) {
            throw new Error('Password required to generate keys');
        }

        if (!availableDomains.length) {
            const error = c('Error').t`Domain not available, try again later`;
            throw new Error(error);
        }

        try {
            await api(queryCheckUsernameAvailability(username));
        } catch (e) {
            const errorText = getApiErrorMessage(e) || c('Error').t`Can't check username, try again later`;
            setUsernameError(errorText);
            throw e;
        }
        await api(updateUsername({ Username: username }));

        const [Address] = await handleSetupAddress({ api, domains: availableDomains, username });

        const { privateKey, privateKeyArmored } = await generateAddressKey({
            email: Address.Email,
            passphrase: keyPassword,
            encryptionConfig: ENCRYPTION_CONFIGS[DEFAULT_ENCRYPTION_CONFIG],
        });

        await createKeyHelper({
            api,
            privateKeyArmored,
            privateKey,
            Address,
            parsedKeys: [],
            actionableKeys: [],
            signingKey: privateKey,
        });
    };

    const handleSubmit = async () => {
        try {
            await handleCreateAddressAndKey();
            await onDone();
        } catch (error) {
            const errorText = getApiErrorMessage(error) || c('Error').t`Unknown error`;
            createNotification({ type: 'error', text: errorText });
        }
    };

    useEffect(() => {
        const fetchAvailableDomains = async () => {
            const { Domains = [] } = await api(queryAvailableDomains());
            setAvailableDomains(Domains);
        };
        fetchAvailableDomains();
    }, []);

    return (
        <Layout
            title={c('Title').t`Create a ProtonMail address`}
            subtitle={c('Info')
                .t`Your Proton Account is associated with ${externalEmailAddress}. To use ${appName}, please create an address.`}
            left={<BackButton onClick={onBack} />}
        >
            <AccountGenerateInternalAddressForm
                username={username}
                usernameError={usernameError}
                setUsername={setUsername}
                setUsernameError={setUsernameError}
                availableDomains={availableDomains}
                onSubmit={handleSubmit}
            />
        </Layout>
    );
};

export default AccountGenerateInternalAddressContainer;
