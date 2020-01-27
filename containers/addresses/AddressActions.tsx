import React from 'react';
import { c } from 'ttag';
import {
    DropdownActions,
    useApi,
    useModals,
    useNotifications,
    useEventManager,
    useLoading,
    ConfirmModal,
    Alert
} from '../../index';
import { deleteAddress, enableAddress, disableAddress } from 'proton-shared/lib/api/addresses';
import { ADDRESS_STATUS } from 'proton-shared/lib/constants';

import EditAddressModal from './EditAddressModal';
import CreateMissingKeysAddressModal from './missingKeys/CreateMissingKeysAddressModal';
import { getPermissions } from './helper';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';
import { OrganizationKey } from '../../hooks/useGetOrganizationKeyRaw';
import { Address, UserModel, Member } from 'proton-shared/lib/interfaces';

interface Props {
    address: Address;
    member?: Member; // undefined if self
    user: UserModel;
    organizationKey?: OrganizationKey;
}
const AddressActions = ({ address, member, user, organizationKey }: Props) => {
    const api = useApi();
    const { call } = useEventManager();
    const [loading, withLoading] = useLoading();
    const { createNotification } = useNotifications();
    const { createModal } = useModals();

    const confirmDelete = async () => {
        return new Promise((resolve, reject) => {
            createModal(
                <ConfirmModal onConfirm={resolve} onClose={reject}>
                    <Alert type="warning">{c('Warning')
                        .t`By deleting this address, you will no longer be able to send or receive emails using this address. Are you sure you want to delete this address?`}</Alert>
                </ConfirmModal>
            );
        });
    };

    const handleDelete = async () => {
        await confirmDelete();
        if (address.Status === ADDRESS_STATUS.STATUS_ENABLED) {
            await api(disableAddress(address.ID));
        }
        await api(deleteAddress(address.ID));
        await call();
        createNotification({ text: c('Success notification').t`Address deleted` });
    };

    const handleEnable = async () => {
        await api(enableAddress(address.ID));
        await call();
        createNotification({ text: c('Success notification').t`Address enabled` });
    };

    const confirmDisable = async () => {
        return new Promise((resolve, reject) => {
            createModal(
                <ConfirmModal onConfirm={resolve} onClose={reject}>
                    <Alert type="warning">{c('Warning')
                        .t`By disabling this address, you will no longer be able to send or receive emails using this address. Are you sure you want to disable this address?`}</Alert>
                </ConfirmModal>
            );
        });
    };

    const handleDisable = async () => {
        await confirmDisable();
        await api(disableAddress(address.ID));
        await call();
        createNotification({ text: c('Success notification').t`Address disabled` });
    };

    const handleGenerate = async () => {
        createModal(
            <CreateMissingKeysAddressModal member={member} addresses={[address]} organizationKey={organizationKey} />
        );
    };

    const { canEdit, canEnable, canDisable, canGenerate, canDelete } = getPermissions({
        member,
        address,
        user,
        organizationKey
    });

    const list = [
        canEdit && {
            text: c('Address action').t`Edit`,
            onClick: () => createModal(<EditAddressModal address={address} />)
        },
        canEnable && {
            text: c('Address action').t`Enable`,
            onClick: () => withLoading(handleEnable())
        },
        canDisable && {
            text: c('Address action').t`Disable`,
            onClick: () => withLoading(handleDisable())
        },
        canGenerate && {
            text: c('Address action').t`Generate missing keys`,
            onClick: () => withLoading(handleGenerate())
        },
        canDelete && {
            text: c('Address action').t`Delete`,
            onClick: () => withLoading(handleDelete())
        }
    ].filter(isTruthy);

    return <DropdownActions className="pm-button--small" list={list} loading={loading} />;
};

export default AddressActions;
