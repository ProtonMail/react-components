import { KEY_FLAG } from 'proton-shared/lib/constants';
import { clearBit } from 'proton-shared/lib/helpers/bitset';
import { FlagAction } from './interface';

export const getNewKeyFlags = (Flags: number, action: FlagAction) => {
    if (action === FlagAction.MARK_OBSOLETE) {
        return clearBit(Flags, KEY_FLAG.VERIFY);
    }
    if (action === FlagAction.MARK_NOT_OBSOLETE) {
        return Flags + KEY_FLAG.VERIFY + KEY_FLAG.ENCRYPT;
    }
    if (action === FlagAction.MARK_COMPROMISED) {
        return clearBit(Flags, KEY_FLAG.VERIFY + KEY_FLAG.ENCRYPT);
    }
    if (action === FlagAction.MARK_NOT_COMPROMISED) {
        return Flags + KEY_FLAG.VERIFY;
    }
    throw new Error('Unknown action');
};
