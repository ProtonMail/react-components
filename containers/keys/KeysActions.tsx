import React from 'react';
import { c } from 'ttag';
import { DropdownActions } from '../../';
import { KeyActions, FlagAction, KeyPermissions } from './shared/interface';

interface Props extends KeyActions, KeyPermissions {
    isLoading: boolean;
    ID: string;
}
const KeysActions = ({
    isLoading,
    ID,
    onReactivateKey,
    onExportPublicKey,
    onExportPrivateKey,
    onSetPrimary,
    onSetFlag,
    onDeleteKey,
    canReactivate,
    canExportPublicKey,
    canExportPrivateKey,
    canMakePrimary,
    canMarkObsolete,
    canMarkNotObsolete,
    canMarkCompromised,
    canMarkNotCompromised,
    canDelete
}: Props) => {
    const list = [
        canReactivate && {
            text: c('Keys actions').t`Reactivate`,
            onClick: () => onReactivateKey(ID)
        },
        canExportPublicKey && {
            text: c('Keys actions').t`Export`,
            onClick: () => onExportPublicKey(ID)
        },
        canExportPrivateKey && {
            text: c('Keys actions').t`Export private key`,
            onClick: () => onExportPrivateKey(ID)
        },
        canMakePrimary && {
            text: c('Keys actions').t`Make primary`,
            onClick: () => onSetPrimary(ID)
        },
        canMarkObsolete && {
            text: c('Keys actions').t`Mark obsolete`,
            tooltip: c('Keys actions').t`Disables encryption with this key`,
            onClick: () => onSetFlag(ID, FlagAction.MARK_OBSOLETE)
        },
        canMarkNotObsolete && {
            text: c('Keys actions').t`Mark not obsolete`,
            tooltip: c('Keys actions').t`Enable encryption with this key`,
            onClick: () => onSetFlag(ID, FlagAction.MARK_NOT_OBSOLETE)
        },
        canMarkCompromised && {
            text: c('Keys actions').t`Mark compromised`,
            tooltip: c('Keys actions').t`Disables signature verification and encryption with this key`,
            onClick: () => onSetFlag(ID, FlagAction.MARK_COMPROMISED)
        },
        canMarkNotCompromised && {
            text: c('Keys actions').t`Mark not compromised`,
            tooltip: c('Keys actions').t`Enable signature verification and encryption with this key`,
            onClick: () => onSetFlag(ID, FlagAction.MARK_NOT_COMPROMISED)
        },
        canDelete && {
            text: c('Keys actions').t`Delete`,
            onClick: () => onDeleteKey(ID)
        }
    ].filter(Boolean);

    return <DropdownActions className="pm-button--small" loading={isLoading} list={list} />;
};

export default KeysActions;
