import React from 'react';

import { Loader } from '../../components';
import { useOrganization, useUser } from '../../hooks';
import { SettingsSectionWide } from '../account';

import AddressesWithMembers from './AddressesWithMembers';
import AddressesWithUser from './AddressesWithUser';

interface Props {
    isOnlySelf?: boolean;
}

const AddressesSection = ({ isOnlySelf }: Props) => {
    const [user] = useUser();
    const [organization, loadingOrganization] = useOrganization();

    const content = user.isAdmin ? (
        <AddressesWithMembers isOnlySelf={isOnlySelf} user={user} organization={organization} />
    ) : (
        <AddressesWithUser user={user} />
    );

    return <SettingsSectionWide>{loadingOrganization ? <Loader /> : content}</SettingsSectionWide>;
};

export default AddressesSection;
