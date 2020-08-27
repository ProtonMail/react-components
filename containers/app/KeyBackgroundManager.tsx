import React, { useEffect, useRef } from 'react';
import { UserModel as tsUserModel, Address } from 'proton-shared/lib/interfaces';
import { noop } from 'proton-shared/lib/helpers/function';

import { useGetAddresses, useGetUser } from '../../hooks';

import PrivateMemberKeyGeneration from './PrivateMemberKeyGeneration';
import ReadableMemberKeyActivation from './ReadableMemberKeyActivation';

interface Props {
    hasPrivateMemberKeyGeneration?: boolean;
    hasReadableMemberKeyActivation?: boolean;
}

const KeyBackgroundManager = ({
    hasPrivateMemberKeyGeneration = false,
    hasReadableMemberKeyActivation = false,
}: Props) => {
    const onceRef = useRef<{ user?: tsUserModel; addresses?: Address[] }>({});
    const getUser = useGetUser();
    const getAddresses = useGetAddresses();

    useEffect(() => {
        const run = async () => {
            const [user, addresses] = await Promise.all([getUser(), getAddresses()]);
            onceRef.current = {
                user,
                addresses,
            };
        };
        run().catch(noop);
    }, []);

    const { addresses, user } = onceRef.current;

    return (
        <>
            {hasPrivateMemberKeyGeneration ? <PrivateMemberKeyGeneration addresses={addresses} user={user} /> : null}
            {hasReadableMemberKeyActivation ? <ReadableMemberKeyActivation addresses={addresses} user={user} /> : null}
        </>
    );
};

export default KeyBackgroundManager;
