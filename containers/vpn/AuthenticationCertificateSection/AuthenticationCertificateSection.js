import React from 'react';
import { c } from 'ttag';
import { queryAuthenticationCertificate, queryAuthenticationCertificateKey } from 'proton-shared/lib/api/vpn';
// import { ENCRYPTION_CONFIGS, ENCRYPTION_TYPES } from 'proton-shared/lib/constants';
// import { randomBytes } from 'crypto';
import {
    exportPrivateKey,
    exportPublicKey,
    generateEcKeyPair,
    generateRsaKeyPair,
    isCryptoSupported,
} from 'proton-shared/lib/keys/keyPair';
import { Button } from '../../../components';
import useApi from '../../../hooks/useApi';
import { useLoading } from '../../../hooks';

const AuthenticationCertificateSection = () => {
    const [loading, withLoading] = useLoading();
    const api = useApi();

    const getKeyPair = async (mode) => {
        if (!isCryptoSupported()) {
            return api(queryAuthenticationCertificateKey(mode));
        }

        const key = await (mode === 'rsa' ? generateRsaKeyPair() : generateEcKeyPair());

        return {
            PrivateKey: await exportPrivateKey(key),
            PublicKey: await exportPublicKey(key),
        };
    };

    const download = async (mode) => {
        // const passphrase = randomBytes(32).toString();
        const { PrivateKey, PublicKey } = await getKeyPair(mode);
        const { SerialNumber, Certificate, ExpirationTime } = await api(
            queryAuthenticationCertificate({
                ClientPublicKey: PublicKey,
                ClientPublicKeyMode: mode,
            })
        );

        const a = document.createElement('a');
        a.setAttribute('style', 'display: none;');
        document.body.appendChild(a);
        const blob = new Blob([Certificate], { type: 'octet/stream' });
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = `authentication-certificate-${SerialNumber}.crt`;
        a.click();
        window.URL.revokeObjectURL(url);
        console.log(PrivateKey, ExpirationTime);
    };

    return (
        <>
            <h3 className="mt2">{c('Title').t`Download authentication certificate`}</h3>
            <div className="mb1">
                <Button onClick={() => withLoading(download('ec'))} loading={loading}>{c('Button')
                    .t`Download EC`}</Button>
                <Button onClick={() => withLoading(download('rsa'))} loading={loading}>{c('Button')
                    .t`Download RSA`}</Button>
            </div>
        </>
    );
};

export default AuthenticationCertificateSection;
