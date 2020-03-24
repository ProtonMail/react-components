import React from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import {
    useMembers,
    useModals,
    useOrganization,
    useOrganizationKey,
    AddressModal,
    Alert,
    Button,
    PrimaryButton,
    Block,
    Table,
    TableHeader,
    TableBody,
    TableRow
} from 'react-components';

const AddressesSection = ({ domainAddresses, domainName, onRedirect }) => {
    const { createModal } = useModals();
    const [members, loadingMembers] = useMembers();
    const [organization, loadingOrganization] = useOrganization();
    const [organizationKey, loadingOrganizationKey] = useOrganizationKey(organization);
    const currentMember = (members || []).find(({ Self }) => Self);

    const getMemberName = (memberID) => {
        const { Name = '' } = members.find(({ ID }) => ID === memberID);
        return Name;
    };

    return (
        <>
            <Alert>{c('Info for domain modal')
                .t`Addresses must be connected to an user account. Click Add user to add a new user account with its own login and inbox that you can connect addresses to.`}</Alert>
            <Block>
                <PrimaryButton
                    disabled={loadingOrganization || loadingOrganizationKey}
                    className="mr1"
                    onClick={() =>
                        createModal(
                            <AddressModal
                                member={currentMember}
                                domainName={domainName}
                                organizationKey={organizationKey}
                            />
                        )
                    }
                >{c('Action').t`Add address`}</PrimaryButton>
                <Button onClick={() => onRedirect('/settings/members')}>{c('Action').t`Add user`}</Button>
            </Block>
            {domainAddresses.length ? (
                <Table>
                    <TableHeader
                        cells={[c('Header for domain modal').t`User`, c('Header for domain modal').t`Address`]}
                    />
                    <TableBody loading={loadingMembers} colSpan={2}>
                        {members &&
                            domainAddresses.map(({ ID, Email, MemberID }) => {
                                return <TableRow key={ID} cells={[getMemberName(MemberID), Email]} />;
                            })}
                    </TableBody>
                </Table>
            ) : null}
        </>
    );
};

AddressesSection.propTypes = {
    domainAddresses: PropTypes.array.isRequired,
    domainName: PropTypes.string.isRequired,
    onRedirect: PropTypes.func.isRequired
};

export default AddressesSection;
