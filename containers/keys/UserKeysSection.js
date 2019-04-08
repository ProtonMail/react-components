import React from 'react';
import { c } from 'ttag';
import {
    Block,
    Group,
    Loader,
    SubTitle,
    ButtonGroup,
    useUser,
    useModals,
    useGetKeys,
    useUserKeys
} from 'react-components';

import { getFormattedUserKeys } from './helper';
import KeysActions, { ACTIONS } from './KeysActions';
import ReactivateKeysModal from './reactivateKeys/ReactivateKeysModal';
import ExportPublicKeyModal from './exportKey/ExportPublicKeyModal';
import ExportPrivateKeyModal from './exportKey/ExportPrivateKeyModal';
import KeysTable from './KeysTable';

const UserKeysSections = () => {
    const { createModal } = useModals();
    const [User] = useUser();
    const getKeysByID = useGetKeys();
    const [userKeysList, loadingUserKeys] = useUserKeys(getKeysByID, User);

    const title = <SubTitle>{c('Title').t`Contact encryption keys`}</SubTitle>;

    if (loadingUserKeys) {
        return (
            <>
                {title}
                <Loader />
            </>
        );
    }

    const formattedKeys = getFormattedUserKeys(User, userKeysList);

    const buttonGroup = [
        {
            onClick: () => {
                const [{ privateKey: primaryPrivateKey }] = userKeysList;
                const { Name } = User;
                createModal(<ExportPrivateKeyModal name={Name} privateKey={primaryPrivateKey} />);
            },
            text: c('Action').t`Export private key`
        }
    ]
        .filter(Boolean)
        .map(({ text, ...props }) => (
            <ButtonGroup key={text} {...props}>
                {text}
            </ButtonGroup>
        ));

    const getKeyActions = (keyIndex) => {
        const formattedKey = formattedKeys[keyIndex];
        const { privateKey } = userKeysList[keyIndex];
        const { isDecrypted } = formattedKey;

        const canExportPublicKey = true;
        const canExportPrivateKey = isDecrypted;
        const canReactivate = !isDecrypted;

        const { Name } = User;

        const actions = [
            canReactivate && {
                type: ACTIONS.REACTIVATE,
                onClick: () => {
                    const userKeysToReactivate = [
                        {
                            User,
                            inactiveKeys: [userKeysList[keyIndex]],
                            keys: userKeysList
                        }
                    ];
                    createModal(<ReactivateKeysModal allKeys={userKeysToReactivate} />);
                }
            },
            canExportPublicKey && {
                type: ACTIONS.EXPORT_PUBLIC_KEY,
                onClick: () => {
                    createModal(<ExportPublicKeyModal name={Name} privateKey={privateKey} />);
                }
            },
            canExportPrivateKey && {
                type: ACTIONS.EXPORT_PRIVATE_KEY,
                onClick: () => {
                    createModal(<ExportPrivateKeyModal name={Name} privateKey={privateKey} />);
                }
            }
        ].filter(Boolean);

        return <KeysActions actions={actions} />;
    };

    return (
        <>
            {title}
            <Block>
                <Group className="mr1">{buttonGroup}</Group>
            </Block>
            <KeysTable keys={formattedKeys} getKeyActions={getKeyActions} />
        </>
    );
};

export default UserKeysSections;
