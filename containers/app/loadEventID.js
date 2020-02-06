import { getLatestID } from 'proton-shared/lib/api/events';

export const getTmpEventID = (cache) => {
    // Set from <ProtonApp/> on login.
    const tmpEventID = cache.get('tmpEventID');
    cache.delete('tmpEventID');
    return tmpEventID;
};

export const setTmpEventID = (cache, eventID) => {
    cache.set('tmpEventID', eventID);
};

export default async (api, cache) => {
    return getTmpEventID(cache) || await api(getLatestID()).then(({ EventID }) => EventID);
}

