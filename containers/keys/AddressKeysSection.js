import React, { useState, useEffect, useRef } from 'react';
import { c } from 'ttag';
import {
    Block,
    Group,
    Button,
    ButtonGroup,
    Select,
    SubTitle,
    Alert,
    useModals,
    useApi,
    useEventManager,
    useGetKeys,
    useUserKeys,
    useAddressesKeys,
    Loader
} from 'react-components';
import createKeysManager from 'proton-shared/lib/keys/keysManager';
import { KEY_FLAG } from 'proton-shared/lib/constants';

import { getAllKeysToReactivate, getFormattedAddressKeys, getNewKeyFlags, getPrimaryKey } from './helper';
import { useUser } from '../../models/userModel';
import { useAddresses } from '../../models/addressesModel';
import KeysTable from './KeysTable';
import KeysActions, { ACTIONS } from './KeysActions';
import AddKeyModal from './addKey/AddKeyModal';
import ImportKeyModal from './importKeys/ImportKeyModal';
import ReactivateKeysModal from './reactivateKeys/ReactivateKeysModal';
import ExportPublicKeyModal from './exportKey/ExportPublicKeyModal';
import ExportPrivateKeyModal from './exportKey/ExportPrivateKeyModal';

const AddressKeysSection = () => {
    const { createModal } = useModals();
    const { call } = useEventManager();
    const api = useApi();
    const [User] = useUser();
    const [Addresses] = useAddresses();
    const getKeysByID = useGetKeys();
    const [userKeysList = []] = useUserKeys(getKeysByID, User);
    const [addressesKeysMap = {}] = useAddressesKeys(getKeysByID, Addresses, User);
    const [loadingAction, setLoadingAction] = useState(false);
    const loadingKeyRef = useRef();

    const [addressIndex, setAddressIndex] = useState(() => (Array.isArray(Addresses) ? 0 : -1));

    useEffect(() => {
        if (addressIndex === -1 && Array.isArray(Addresses)) {
            setAddressIndex(0);
        }
    }, [addressIndex, Addresses]);

    const title = <SubTitle>{c('Title').t`Email encryption keys`}</SubTitle>;

    if (addressIndex === -1 || !Array.isArray(Addresses)) {
        return (
            <>
                {title}
                <Loader />
            </>
        );
    }

    if (!Addresses.length) {
        return (
            <>
                {title}
                <Alert>{c('Info').t`No addresses exist`}</Alert>
            </>
        );
    }

    const formattedAddressesKeys = Addresses.reduce((acc, Address) => {
        const { ID: AddressID } = Address;
        acc[AddressID] = getFormattedAddressKeys(User, Address, addressesKeysMap[AddressID]);
        return acc;
    }, {});

    const selectedAddress = Addresses[addressIndex];
    const { ID: selectedAddressID } = selectedAddress;

    const selectedAddressKeys = addressesKeysMap[selectedAddressID] || [];
    const selectedAddressFormattedKeys = formattedAddressesKeys[selectedAddressID] || [];

    const withLoading = (fn) => async (...args) => {
        // Since an action affects the whole key list, only allow one at a time.
        if (loadingAction) {
            return;
        }
        try {
            setLoadingAction(true);
            await fn(...args);
            setLoadingAction(false);
        } catch (e) {
            setLoadingAction(false);
        }
    };

    const withLoadingKeyID = (KeyID, fn) => (...args) => {
        loadingKeyRef.current = KeyID;
        fn(...args);
    };

    const { isSubUser } = User;
    const canAddKey = !isSubUser;
    const { privateKey: primaryPrivateKey } = getPrimaryKey(selectedAddressKeys) || {};
    const canExport = primaryPrivateKey && primaryPrivateKey.isDecrypted();

    const buttonGroup = [
        canAddKey && {
            className: 'pm-button--primary',
            onClick: () => {
                createModal(<AddKeyModal Address={selectedAddress} addressKeys={selectedAddressKeys} />);
            },
            text: c('Action').t`Add key`
        },
        canAddKey && {
            onClick: () => {
                createModal(<ImportKeyModal Address={selectedAddress} addressKeys={selectedAddressKeys} />);
            },
            text: c('Action').t`Import key`
        },
        canExport && {
            onClick: () => {
                const { Email } = selectedAddress;
                createModal(<ExportPublicKeyModal name={Email} privateKey={primaryPrivateKey} />);
            },
            text: c('Action').t`Export public key`
        },
        canExport && {
            onClick: () => {
                const { Email } = selectedAddress;
                createModal(<ExportPrivateKeyModal name={Email} privateKey={primaryPrivateKey} />);
            },
            text: c('Action').t`Export private key`
        }
    ]
        .filter(Boolean)
        .map(({ text, onClick, ...props }) => (
            <ButtonGroup key={text} onClick={withLoading(onClick)} {...props}>
                {text}
            </ButtonGroup>
        ));

    const allKeysToReactivate = getAllKeysToReactivate({ Addresses, User, addressesKeysMap, userKeysList });
    const totalInactiveKeys = allKeysToReactivate.reduce((acc, { inactiveKeys }) => acc + inactiveKeys.length, 0);
    const canReactivateKey = !isSubUser && totalInactiveKeys >= 1;
    const reactivateAllKeysButton = canReactivateKey && (
        <Button
            onClick={withLoading(() => {
                createModal(<ReactivateKeysModal allKeys={allKeysToReactivate} />);
            })}
        >
            {c('Action').t`Reactivate keys (${totalInactiveKeys})`}
        </Button>
    );

    const getKeyActions = (keyIndex) => {
        const formattedKey = selectedAddressFormattedKeys[keyIndex];
        const { Key, privateKey } = selectedAddressKeys[keyIndex];
        const Address = selectedAddress;

        const { ID: KeyID, Flags } = Key;
        const { Email, Status } = Address;

        const { isDisabled, isPrimary, isDecrypted, isCompromised, isObsolete } = formattedKey;

        const canExportPublicKey = true;
        const canExportPrivateKey = isDecrypted;
        const canReactivate = !isDecrypted;
        const canDelete = !isPrimary;
        const canMakePrimary = !isPrimary && isDecrypted && Flags === KEY_FLAG.ENCRYPTED_AND_SIGNED && Status !== 0;
        const canMark = !isPrimary;
        const canMarkObsolete = canMark && !isDisabled && isDecrypted && !isObsolete && !isCompromised;
        const canMarkCompromised = canMark && !isCompromised;
        const canMarkNotCompromised = canMark && isCompromised;
        const canMarkNotObsolete = canMark && isObsolete;

        const createSetFlagsCallback = (actionType) => async () => {
            const newFlags = getNewKeyFlags(actionType);
            const keysManager = createKeysManager(selectedAddressKeys, api);
            await keysManager.setKeyFlags(KeyID, newFlags);
            await call();
        };

        const actions = [
            canReactivate && {
                type: ACTIONS.REACTIVATE,
                onClick: () => {
                    const addressKeysToReactivate = [
                        {
                            Address,
                            inactiveKeys: [selectedAddressKeys[keyIndex]],
                            keys: selectedAddressKeys
                        }
                    ];
                    createModal(<ReactivateKeysModal allKeys={addressKeysToReactivate} />);
                }
            },
            canExportPublicKey && {
                type: ACTIONS.EXPORT_PUBLIC_KEY,
                onClick: () => {
                    createModal(<ExportPublicKeyModal name={Email} privateKey={privateKey} />);
                }
            },
            canExportPrivateKey && {
                type: ACTIONS.EXPORT_PRIVATE_KEY,
                onClick: () => {
                    createModal(<ExportPrivateKeyModal name={Email} privateKey={privateKey} />);
                }
            },
            canMakePrimary && {
                type: ACTIONS.PRIMARY,
                onClick: async () => {
                    const keysManager = createKeysManager(selectedAddressKeys, api);
                    await keysManager.setKeyPrimary(KeyID);
                    await call();
                }
            },
            canMarkObsolete && {
                type: ACTIONS.MARK_OBSOLETE,
                onClick: createSetFlagsCallback(ACTIONS.MARK_OBSOLETE)
            },
            canMarkNotObsolete && {
                type: ACTIONS.MARK_NOT_OBSOLETE,
                onClick: createSetFlagsCallback(ACTIONS.MARK_NOT_OBSOLETE)
            },
            canMarkCompromised && {
                type: ACTIONS.MARK_COMPROMISED,
                onClick: createSetFlagsCallback(ACTIONS.MARK_COMPROMISED)
            },
            canMarkNotCompromised && {
                type: ACTIONS.MARK_NOT_COMPROMISED,
                onClick: createSetFlagsCallback(ACTIONS.MARK_NOT_COMPROMISED)
            },
            canDelete && {
                type: ACTIONS.DELETE,
                onClick: async () => {
                    const keysManager = createKeysManager(selectedAddressKeys, api);
                    await keysManager.removeKey(KeyID);
                    await call();
                }
            }
        ]
            .filter(Boolean)
            .map(({ onClick, ...rest }) => ({
                ...rest,
                onClick: withLoadingKeyID(KeyID, withLoading(onClick))
            }));

        return <KeysActions loading={loadingKeyRef.current === KeyID && loadingAction} actions={actions} />;
    };

    return (
        <>
            {title}
            <Alert learnMore="todo">
                {c('Info')
                    .t`Download your PGP Keys for use with other PGP compatible services. Only incoming messages in inline OpenPGP format are currently supported.`}
            </Alert>
            <Block>
                <Group className="mr1">{buttonGroup}</Group>
                {reactivateAllKeysButton}
            </Block>
            {Addresses.length > 1 ? (
                <Select
                    value={addressIndex}
                    options={Addresses.map(({ Email, ID: AddressID }, i) => {
                        const primaryKey = (formattedAddressesKeys[AddressID] || []).find(
                            ({ isPrimary }) => !!isPrimary
                        );
                        const postfix = primaryKey ? ` (${primaryKey.fingerprint})` : '';
                        return {
                            text: Email + postfix,
                            value: i
                        };
                    })}
                    onChange={({ target }) => setAddressIndex(+target.value)}
                />
            ) : null}
            <KeysTable keys={selectedAddressFormattedKeys} getKeyActions={getKeyActions} />
        </>
    );
};

AddressKeysSection.propTypes = {};

export default AddressKeysSection;
