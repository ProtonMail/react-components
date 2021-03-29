import React from 'react';
import { c } from 'ttag';
import { queryAuthenticationCertificate, queryAuthenticationCertificateKey } from 'proton-shared/lib/api/vpn';
// import { ENCRYPTION_CONFIGS, ENCRYPTION_TYPES } from 'proton-shared/lib/constants';
// import { randomBytes } from 'crypto';
import { Button } from '../../../components';
import useApi from '../../../hooks/useApi';
import { useLoading } from '../../../hooks';

const AuthenticationCertificateSection = () => {
    const [loading, withLoading] = useLoading();
    const api = useApi();

    const download = async () => {
        // const passphrase = randomBytes(32).toString();
        const { PrivateKey, PublicKey } = await api(queryAuthenticationCertificateKey());
        const { SerialNumber, Certificate, ExpirationTime } = await api(
            queryAuthenticationCertificate({
                ClientPublicKey: PublicKey,
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
                <Button onClick={() => withLoading(download())} loading={loading}>{c('Button').t`Download`}</Button>
            </div>
        </>
    );
};

export default AuthenticationCertificateSection;
