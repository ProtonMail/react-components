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
export const convertKey = ({ Address, privateKey, Key: { ID, Primary, Flags } }) => {
    const algorithmInfo = privateKey.getAlgorithmInfo();
    const fingerprint = privateKey.getFingerprint();
    const isDecrypted = privateKey.isDecrypted();

    const { Status } = Address || {};
    const isAddressDisabled = Status === 0;

    const status = {
        isAddressKey: !!Address,
        isPrimary: Primary === 1,
        isDecrypted,
        isEncryptingAndSigning: Flags === ENCRYPTED_AND_SIGNED,
        isCompromised: Flags === CLEAR_TEXT,
        isObsolete: isDecrypted && !isAddressDisabled && Flags === SIGNED,
        isAddressDisabled
    };

    return {
        ID,
        fingerprint,
        algorithm: describe(algorithmInfo),
        ...status
    };
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
export const getAllKeysToReactivate = ({ Addresses = [], addressesKeysMap = {}, User, userKeysList = [] }) => {
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
