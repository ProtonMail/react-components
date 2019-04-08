import { KEY_FLAG } from 'proton-shared/lib/constants';
import { describe } from 'proton-shared/lib/keys/keysAlgorithm';

import { ACTIONS } from './KeysActions';

const { SIGNED, ENCRYPTED_AND_SIGNED, CLEAR_TEXT } = KEY_FLAG;

/**
 * @param {Array} keys
 * @return {Object}
 */
export const getPrimaryKey = (keys) => {
    return keys.find(({ Key: { Primary } }) => Primary === 1);
};

/**
 * Convert a key for display in the view.
 * @param {Object} [Address] - The address the key belongs to
 * @param {Object} privateKey - Parsed pgp key
 * @param {Object} Key - Key result from the API
 * @returns {Object}
 */
export const convertKey = ({
    Address = {},
    key: {
        privateKey,
        Key: { Primary, Flags }
    }
}) => {
    const algorithmInfo = privateKey.getAlgorithmInfo();
    const fingerprint = privateKey.getFingerprint();
    const isDecrypted = privateKey.isDecrypted();

    const { Status } = Address;
    const isDisabled = Status === 0;

    const status = {
        isPrimary: Primary === 1,
        isDecrypted,
        isCompromised: Flags === CLEAR_TEXT,
        isObsolete: isDecrypted && !isDisabled && Flags === SIGNED,
        isDisabled
    };

    return {
        fingerprint,
        type: describe(algorithmInfo),
        ...status
    };
};

/**
 * @param {Object} User
 * @param {Array} userKeys
 * @return {Array<Object>}
 */
export const getFormattedUserKeys = (User, userKeys = []) => {
    return userKeys.map(({ privateKey, Key }) => {
        return convertKey({
            User,
            key: {
                privateKey,
                Key
            }
        });
    });
};

/**
 * @param {Object} User
 * @param {Object} Address
 * @param {Array} addressKeys
 * @return {Array<Object>}
 */
export const getFormattedAddressKeys = (User, Address, addressKeys = []) => {
    return addressKeys.map(({ privateKey, Key }) => {
        return convertKey({
            User,
            Address,
            key: {
                privateKey,
                Key
            }
        });
    });
};

/**
 * @param {Array} keys
 * @return {Array}
 */
const getKeysToReactivate = (keys = []) => {
    return keys.filter(({ privateKey }) => !privateKey.isDecrypted());
};

/**
 * @param {Array} Addresses
 * @param {Object} addressesKeysMap
 * @param {Object} User
 * @param {Array} userKeysList
 * @return {Array}
 */
export const getAllKeysToReactivate = ({ Addresses = [], addressesKeysMap, User, userKeysList }) => {
    const allAddressesKeys = Addresses.map((Address) => {
        const { ID } = Address;
        const addressKeysList = addressesKeysMap[ID];
        const addressKeysToReactivate = getKeysToReactivate(addressKeysList);
        if (!addressKeysToReactivate.length) {
            return;
        }
        return {
            Address,
            keys: addressKeysList,
            inactiveKeys: addressKeysToReactivate
        };
    });

    const userKeysToReactivate = getKeysToReactivate(userKeysList);

    return [
        ...allAddressesKeys,
        userKeysToReactivate.length && {
            User,
            keys: userKeysList,
            inactiveKeys: userKeysToReactivate
        }
    ].filter(Boolean);
};

/**
 * @param {number} action
 * @return {number}
 */
export const getNewKeyFlags = (action) => {
    if (action === ACTIONS.MARK_OBSOLETE) {
        return SIGNED;
    }
    if (action === ACTIONS.MARK_NOT_OBSOLETE) {
        return ENCRYPTED_AND_SIGNED;
    }
    if (action === ACTIONS.MARK_COMPROMISED) {
        return CLEAR_TEXT;
    }
    if (action === ACTIONS.MARK_NOT_COMPROMISED) {
        return SIGNED;
    }
    throw new Error('Unknown action');
};
