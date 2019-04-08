import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { DropdownActions } from 'react-components';

export const ACTIONS = {
    PRIMARY: 1,
    DELETE: 2,
    EXPORT_PUBLIC_KEY: 3,
    EXPORT_PRIVATE_KEY: 4,
    REACTIVATE: 5,
    MARK_OBSOLETE: 6,
    MARK_NOT_OBSOLETE: 7,
    MARK_COMPROMISED: 8,
    MARK_NOT_COMPROMISED: 9
};

const KeyActionExport = () => ({
    text: c('Keys actions').t`Export`
});

const KeyActionExportPrivateKey = () => ({
    text: c('Keys actions').t`Export private key`
});

const KeyActionDelete = () => ({
    text: c('Keys actions').t`Delete`
});

const KeyActionPrimary = () => ({
    text: c('Keys actions').t`Make primary`
});

const KeyActionReactive = () => ({
    text: c('Keys actions').t`Reactivate`
});

const KeyActionMarkObsolete = () => ({
    text: c('Keys actions').t`Mark obsolete`,
    tooltip: c('Keys actions').t`Disables encryption with this key`
});

const KeyActionMarkNotObsolete = () => ({
    text: c('Keys actions').t`Mark not obsolete`,
    tooltip: c('Keys actions').t`Enable encryption with this key`
});

const KeyActionMarkCompromised = () => ({
    text: c('Keys actions').t`Mark compromised`,
    tooltip: c('Keys actions').t`Disables signature verification and encryption with this key`
});

const KeyActionMarkNotCompromised = () => ({
    text: c('Keys actions').t`Mark not compromised`,
    tooltip: c('Keys actions').t`Enable signature verification and encryption with this key`
});

const ACTIONS_TO_TEXT = {
    [ACTIONS.PRIMARY]: KeyActionPrimary,
    [ACTIONS.DELETE]: KeyActionDelete,
    [ACTIONS.EXPORT_PUBLIC_KEY]: KeyActionExport,
    [ACTIONS.EXPORT_PRIVATE_KEY]: KeyActionExportPrivateKey,
    [ACTIONS.REACTIVATE]: KeyActionReactive,
    [ACTIONS.MARK_COMPROMISED]: KeyActionMarkCompromised,
    [ACTIONS.MARK_OBSOLETE]: KeyActionMarkObsolete,
    [ACTIONS.MARK_NOT_COMPROMISED]: KeyActionMarkNotCompromised,
    [ACTIONS.MARK_NOT_OBSOLETE]: KeyActionMarkNotObsolete
};

const KeysActions = ({ actions, loading }) => {
    const list = actions.map(({ type, onClick }) => ({
        ...ACTIONS_TO_TEXT[type](),
        onClick
    }));
    return <DropdownActions loading={loading} list={list} />;
};

KeysActions.propTypes = {
    actions: PropTypes.array.isRequired,
    loading: PropTypes.bool
};

export default KeysActions;
