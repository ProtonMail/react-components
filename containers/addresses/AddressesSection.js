import React from 'react';
import { c, msgid } from 'ttag';
import { Block, Loader, SubTitle, useOrganization, useUser } from 'react-components';

import AddressesWithMembers from './AddressesWithMembers';
import AddressesWithUser from './AddressesWithUser';

const AddressesSection = () => {
    const [user] = useUser();
    const [organization, loadingOrganization] = useOrganization();

    const { MaxMembers, UsedAddresses, MaxAddresses } = organization || {};

    if (loadingOrganization) {
        return <Loader />;
    }

    return (
        <>
            <SubTitle>{c('Title').t`Addresses`}</SubTitle>
            {MaxMembers > 1 && user.isAdmin ? (
                <AddressesWithMembers user={user} organization={organization} />
            ) : (
                <AddressesWithUser user={user} />
            )}
            {MaxAddresses > 1 ? (
                <Block className="opacity-50">
                    {UsedAddresses} / {MaxAddresses}{' '}
                    {c('Info').ngettext(msgid`address used`, `addresses used`, UsedAddresses)}
                </Block>
            ) : null}
        </>
    );
};

export default AddressesSection;
