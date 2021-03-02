import React from 'react';
import { c } from 'ttag';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';
import { Address } from 'proton-shared/lib/interfaces';

import { DropdownActions, Select } from '../../components';

interface Props {
    addresses: Address[];
    addressIndex: number;
    onAddKey?: () => void;
    onImportKey?: () => void;
    onExportPublic?: () => void;
    onExportPrivate?: () => void;
    onChangeAddress: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const AddressKeysHeaderActions = ({
    addresses,
    addressIndex,
    onAddKey,
    onImportKey,
    onExportPublic,
    onExportPrivate,
    onChangeAddress,
}: Props) => {
    const createActions = [
        onAddKey && {
            text: c('Action').t`Create key`,
            onClick: onAddKey,
        },
        onImportKey && {
            text: c('Action').t`Import key`,
            onClick: onImportKey,
        },
    ].filter(isTruthy);

    const exportActions = [
        onExportPublic && {
            text: c('Action').t`Export`,
            onClick: onExportPublic,
        },
        onExportPrivate && {
            text: c('Address action').t`Export private key`,
            onClick: onExportPrivate,
        },
    ].filter(isTruthy);

    if (!exportActions.length && !createActions.length) {
        return null;
    }

    return (
        <div className="mb1">
            {addresses.length > 1 && (
                <Select
                    value={addressIndex}
                    options={addresses.map(({ Email }, i) => ({ text: Email, value: i }))}
                    onChange={onChangeAddress}
                    className="wauto mr1"
                />
            )}
            {createActions.length ? (
                <span className="mr1">
                    <DropdownActions list={createActions} />
                </span>
            ) : null}
            <DropdownActions list={exportActions} />
        </div>
    );
};

export default AddressKeysHeaderActions;
