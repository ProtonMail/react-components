import React, { useEffect, useState } from 'react';
import { c } from 'ttag';

import { isValid, format } from 'date-fns';
import { dateLocale } from 'proton-shared/lib/i18n';
import getPublicKeysEmailHelper from 'proton-shared/lib/api/helpers/getPublicKeysEmailHelper';
import { getIsInternalUser, getKeyEncryptStatus } from 'proton-shared/lib/keys/publicKeys';
import { algorithmInfo, OpenPGPKey } from 'pmcrypto';
import { getFormattedAlgorithmName } from 'proton-shared/lib/keys/keyAlgorithm';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';

import { Badge, KeyWarningIcon, Table, TableBody, TableRow } from '../../../components';
import { useActiveBreakpoint, useApi } from '../../../hooks';

type LocaKeyModel = {
    emailAddress: string;
    publicKey: OpenPGPKey;
    fingerprint: string;
    algo: string;
    creationTime: Date;
    expirationTime: any;
    isPrimary?: boolean;
    isExpired: boolean;
    isRevoked: boolean;
    isOwnedByInteralUser: boolean;
};

interface Props {
    emailAddress: string;
}

const KTKeysTable = ({ emailAddress }: Props) => {
    const api = useApi();
    const { isNarrow, isTinyMobile } = useActiveBreakpoint();
    const [keys, setKeys] = useState<LocaKeyModel[]>([]);

    /**
     * Extract keys info from apiKeysConfig to define table body
     */
    const parse = async () => {
        const apiKeysConfig = await getPublicKeysEmailHelper(api, emailAddress);
        const apiKeys = apiKeysConfig.publicKeys.filter(isTruthy);
        const isInternalUser = getIsInternalUser(apiKeysConfig);
        const parsedKeys = await Promise.all(
            apiKeys.map(async (publicKey, index) => {
                const fingerprint = publicKey.getFingerprint();
                const creationTime = publicKey.getCreationTime();
                const expirationTime = await publicKey.getExpirationTime('encrypt');
                const algoInfo = publicKey.getAlgorithmInfo();
                const algo = getFormattedAlgorithmName(algoInfo as algorithmInfo);
                const { isExpired, isRevoked } = await getKeyEncryptStatus(publicKey);
                const isPrimary = !index && !isExpired && !isRevoked;
                return {
                    emailAddress,
                    publicKey,
                    fingerprint,
                    algo,
                    creationTime,
                    expirationTime,
                    isPrimary,
                    isExpired,
                    isRevoked,
                    isOwnedByInteralUser: isInternalUser,
                };
            })
        );
        setKeys(parsedKeys);
    };

    useEffect(() => {
        void parse();
    }, [emailAddress]);

    return (
        <Table className="pm-simple-table">
            <thead>
                <tr>
                    <th scope="col" className="ellipsis">{c('Table header').t`Fingerprint`}</th>
                    {!isNarrow && <th scope="col" className="ellipsis">{c('Table header').t`Created`}</th>}
                    {!isTinyMobile && <th scope="col" className="ellipsis">{c('Table header').t`Expires`}</th>}
                    {!isNarrow && <th scope="col" className="ellipsis">{c('Table header').t`Type`}</th>}
                    <th scope="col" className="ellipsis">{c('Table header').t`Status`}</th>
                </tr>
            </thead>
            <TableBody>
                {keys.map(
                    ({
                        emailAddress: locaEmailAddress,
                        fingerprint,
                        algo,
                        creationTime,
                        expirationTime,
                        isPrimary,
                        publicKey,
                        isExpired,
                        isRevoked,
                        isOwnedByInteralUser,
                    }) => {
                        const creation = new Date(creationTime);
                        const expiration = new Date(expirationTime);

                        const cells = [
                            <div key={fingerprint} title={fingerprint} className="flex flex-nowrap">
                                <KeyWarningIcon
                                    className="mr0-5 flex-item-noshrink"
                                    publicKey={publicKey}
                                    emailAddress={locaEmailAddress}
                                    isInternal={isOwnedByInteralUser}
                                />
                                <span className="flex-item-fluid ellipsis">{fingerprint}</span>
                            </div>,
                            !isNarrow && (isValid(creation) ? format(creation, 'PP', { locale: dateLocale }) : '-'),
                            !isTinyMobile &&
                                (isValid(expiration) ? format(expiration, 'PP', { locale: dateLocale }) : '-'),
                            !isNarrow && algo,
                            <React.Fragment key={fingerprint}>
                                {isPrimary ? <Badge>{c('Key badge').t`Primary`}</Badge> : null}
                                {isRevoked ? <Badge type="error">{c('Key badge').t`Revoked`}</Badge> : null}
                                {isExpired ? <Badge type="error">{c('Key badge').t`Expired`}</Badge> : null}
                            </React.Fragment>,
                        ].filter(Boolean);
                        return <TableRow key={fingerprint} cells={cells} />;
                    }
                )}
            </TableBody>
        </Table>
    );
};

export default KTKeysTable;
