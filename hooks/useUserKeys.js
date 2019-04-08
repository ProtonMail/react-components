import useCachedAsyncResult from './useCachedAsyncResult';

const useUserKeys = (getKeysByID, User) => {
    return useCachedAsyncResult(
        'USER_KEYS',
        () => {
            return getKeysByID(User.ID, User.Keys, User.OrganizationPrivateKey);
        },
        [User]
    );
};

export default useUserKeys;
