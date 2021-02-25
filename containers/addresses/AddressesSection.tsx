import React from 'react';

import { Loader } from '../../components';
import { useOrganization, useUser } from '../../hooks';

import AddressesWithMembers from './AddressesWithMembers';
import AddressesWithUser from './AddressesWithUser';

interface Props {
    isOnlySelf?: boolean;
}

const AddressesSection = ({ isOnlySelf }: Props) => {
    const [user] = useUser();
    const [organization, loadingOrganization] = useOrganization();

    if (loadingOrganization) {
        return <Loader />;
    }

    return (
        <>
            {user.isAdmin ? (
                <AddressesWithMembers isOnlySelf={isOnlySelf} user={user} organization={organization} />
            ) : (
                <AddressesWithUser user={user} />
            )}
        </>
    );
};

export default AddressesSection;
