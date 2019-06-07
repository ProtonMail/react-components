import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMove } from 'react-sortable-hoc';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    useUser,
    useAddresses,
    useApiWithoutResult,
    useEventManager
} from 'react-components';
import { ALL_MEMBERS_ID } from 'proton-shared/lib/constants';
import { queryAddresses } from 'proton-shared/lib/api/members';
import { orderAddress } from 'proton-shared/lib/api/addresses';

import AddressActions from './AddressActions';
import AddressStatus from './AddressStatus';

const formatAddresses = (addresses = {}, member = {}) => addresses.map((address) => ({ ...address, member }));

function addressList({ addresses, user, allMembers, fetchAddresses, ...props }) {
    return (
        <TableBody colSpan={allMembers ? 4 : 3} {...props}>
            {addresses.map((address, index) => {
                const key = address.ID;
                const cells = [
                    address.Email,
                    <AddressStatus key={key} address={address} index={index} />,
                    <AddressActions user={user} key={key} address={address} fetchAddresses={fetchAddresses} />
                ];

                if (allMembers) {
                    cells.splice(1, 0, address.member.Name);
                }

                return <TableRow key={key} cells={cells} index={index} />;
            })}
        </TableBody>
    );
}

const AddressList = SortableContainer(addressList);

const AddressesTable = ({ member, members }) => {
    const [user] = useUser();
    const [userAddresses = [], loadingAddresses] = useAddresses();
    const { request, loading } = useApiWithoutResult(queryAddresses);
    const [addresses, setAddresses] = useState([]);
    const allMembers = member && member.ID === ALL_MEMBERS_ID;
    const header = [
        c('Header for addresses table').t`Address`,
        c('Header for addresses table').t`Status`,
        c('Header for addresses table').t`Actions`
    ];

    const { call } = useEventManager();
    const orderRequest = useApiWithoutResult(orderAddress);

    if (allMembers) {
        header.splice(1, 0, c('Header for addresses table').t`Username`);
    }

    const fetchAddresses = async () => {
        if (!member) {
            return setAddresses(formatAddresses(userAddresses, { Self: 1 }));
        }

        if (allMembers) {
            return setAddresses(
                await Promise.all(
                    members.map((member) => {
                        if (member.Self) {
                            return formatAddresses(userAddresses, member);
                        }
                        return request(member.ID).then(({ Addresses }) => formatAddresses(Addresses, member));
                    })
                ).then((result) => result.reduce((acc, addresses) => acc.concat(addresses), []))
            );
        }

        if (member.Self) {
            return setAddresses(formatAddresses(userAddresses, member));
        }

        const { Addresses } = await request(member.ID);

        setAddresses(formatAddresses(Addresses, member));
    };

    const handleSort = async ({ oldIndex, newIndex }) => {
        const newList = arrayMove(addresses, oldIndex, newIndex);
        setAddresses(newList);
        await orderRequest.request(newList.map(({ ID }) => ID));
        await call();
    };

    useEffect(() => {
        fetchAddresses();
    }, [member, loadingAddresses]);

    return (
        <Table>
            <TableHeader cells={header} />
            <AddressList
                user={user}
                addresses={addresses}
                allMembers={allMembers}
                onSortEnd={handleSort}
                pressDelay={200}
                fetchAddresses={fetchAddresses}
                helperClass="line color-global-grey bg-white w10"
                loading={loading || loadingAddresses}
            />
        </Table>
    );
};

AddressesTable.propTypes = {
    member: PropTypes.object,
    members: PropTypes.array
};

export default AddressesTable;
