import { usePromiseResult, useCache, useApi, useAddresses } from 'react-components';
import { queryAddresses } from 'proton-shared/lib/api/members';
import { cachedPromise } from './helpers/cachedPromise';

const useMemberAddresses = (members) => {
    const cache = useCache();
    const api = useApi();
    const [addresses] = useAddresses();

    return usePromiseResult(async () => {
        if (!Array.isArray(members)) {
            return;
        }

        const memberAddresses = await Promise.all(
            members.map((member) => {
                if (member.Self) {
                    return Promise.resolve(addresses);
                }
                return cachedPromise(
                    cache,
                    member.ID,
                    () => {
                        return api(queryAddresses(member.ID)).then(({ Addresses = [] }) => Addresses);
                    },
                    member
                );
            })
        );

        return members.reduce((acc, { ID }, i) => {
            return {
                ...acc,
                [ID]: memberAddresses[i]
            };
        }, {});
    }, [members, addresses]);
};

export default useMemberAddresses;
