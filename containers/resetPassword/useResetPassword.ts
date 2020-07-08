import { useRef, useState } from 'react';
import { c } from 'ttag';
import { requestLoginResetToken, validateResetToken } from 'proton-shared/lib/api/reset';
import { generateKeySaltAndPassphrase } from 'proton-shared/lib/keys/keys';
import { getResetAddressesKeys } from 'proton-shared/lib/keys/resetKeys';
import { srpAuth, srpVerify } from 'proton-shared/lib/srp';
import { resetKeysRoute } from 'proton-shared/lib/api/keys';
import { Address } from 'proton-shared/lib/interfaces';
import { setCookies, auth } from 'proton-shared/lib/api/auth';
import { getRandomString } from 'proton-shared/lib/helpers/string';
import { OnLoginArgs } from '../login/useLogin';
import { useApi, useNotifications } from '../../index';

export enum STEPS {
    REQUEST_RESET_TOKEN,
    VALIDATE_RESET_TOKEN,
    DANGER_VERIFICATION,
    NEW_PASSWORD,
    ERROR
}

interface Props {
    onLogin: (args: OnLoginArgs) => void;
}

const useResetPassword = ({ onLogin }: Props) => {
    const api = useApi();
    const [step, setStep] = useState(STEPS.REQUEST_RESET_TOKEN);
    const { createNotification } = useNotifications();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [danger, setDanger] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const addressesRef = useRef<Address[]>([]);
    const dangerWord = 'DANGER';

    const handleRequest = async () => {
        await api(requestLoginResetToken({ Username: username, NotificationEmail: email }));
        setStep(STEPS.VALIDATE_RESET_TOKEN);
    };

    const handleValidateResetToken = async () => {
        const { Addresses = [] } = await api<{ Addresses: Address[] }>(validateResetToken(username, token));
        addressesRef.current = Addresses;
        setStep(STEPS.DANGER_VERIFICATION);
    };

    const handleDanger = () => {
        if (danger !== dangerWord) {
            return;
        }
        setStep(STEPS.NEW_PASSWORD);
    };

    const handleNewPassword = async () => {
        if (!password.length || password !== confirmPassword) {
            return;
        }
        const addresses = addressesRef.current;
        if (!addresses) {
            throw new Error('Missing addresses');
        }
        createNotification({
            text: c('Info').t`This can take a few seconds or a few minutes depending on your device.`,
            type: 'info'
        });
        const { passphrase, salt } = await generateKeySaltAndPassphrase(password);
        const newAddressesKeys = await getResetAddressesKeys({ addresses, passphrase });
        // Assume the primary address is the first item in the list.
        const [primaryAddress] = newAddressesKeys;

        await srpVerify({
            api,
            credentials: { password },
            config: resetKeysRoute({
                Username: username,
                Token: token,
                KeySalt: salt,
                PrimaryKey: primaryAddress ? primaryAddress.PrivateKey : undefined,
                AddressKeys: newAddressesKeys
            })
        });

        const { UID, EventID, AccessToken, RefreshToken } = await srpAuth({
            api,
            credentials: { username, password },
            config: auth({ Username: username })
        });
        await api(setCookies({ UID, AccessToken, RefreshToken, State: getRandomString(24) }));

        onLogin({ UID, keyPassword: passphrase, EventID });
    };

    return {
        username,
        setUsername,
        token,
        setToken,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        danger,
        setDanger,
        dangerWord,
        handleRequest,
        handleValidateResetToken,
        handleDanger,
        handleNewPassword: () =>
            handleNewPassword().catch((e) => {
                setStep(STEPS.ERROR);
                throw e;
            }),
        step
    };
};

export default useResetPassword;
