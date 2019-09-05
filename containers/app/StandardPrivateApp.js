import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    EventManagerProvider,
    ModalsChildren,
    ThemeInjector,
    LocaleInjector,
    useApi,
    useCache,
    useLocaleLoader
} from 'react-components';
import { UserModel, UserSettingsModel } from 'proton-shared/lib/models';

import createEventManager from 'proton-shared/lib/eventManager/eventManager';
import { loadModels } from 'proton-shared/lib/models/helper';
import { loadOpenPGP } from 'proton-shared/lib/openpgp';
import { uniqueBy } from 'proton-shared/lib/helpers/array';
import { getLatestID } from 'proton-shared/lib/api/events';

import ModelListener from '../eventManager/ModelListener';
import EventNotices from '../eventManager/EventNotices';
import LoaderPage from './LoaderPage';

const getEventID = ({ cache, api }) => {
    // Set from <ProtonApp/> on login.
    const { eventID: tmpEventID } = cache.get('tmp') || {};
    cache.set('tmp', undefined);
    return Promise.resolve(tmpEventID || api(getLatestID()).then(({ EventID }) => EventID));
};

const Preload = ({ preloadModels = [], onSuccess, onError }) => {
    const loadLocale = useLocaleLoader();
    const api = useApi();
    const cache = useCache();

    useEffect(() => {
        (async () => {
            const [[userSettings], eventID] = await Promise.all([
                loadModels(uniqueBy([UserSettingsModel, UserModel, ...preloadModels], (x) => x), { api, cache }),
                getEventID({ api, cache }),
                loadOpenPGP()
            ]);
            await loadLocale(userSettings.Locale);
            return createEventManager({ api, eventID });
        })()
            .then(onSuccess)
            .catch(onError);
    }, []);

    return null;
};

const StandardPrivateApp = ({ onLogout, preloadModels = [], eventModels = [], children }) => {
    const [loading, setLoading] = useState(true);
    const eventManagerRef = useRef();

    if (loading) {
        return (
            <>
                <Preload
                    eventModels={eventModels}
                    preloadModels={preloadModels}
                    onSuccess={(ev) => {
                        eventManagerRef.current = ev;
                        setLoading(false);
                    }}
                    onError={onLogout}
                />
                <ModalsChildren />
                <LoaderPage />
            </>
        );
    }

    return (
        <EventManagerProvider eventManager={eventManagerRef.current}>
            <ModelListener models={eventModels} />
            <EventNotices />
            <ThemeInjector />
            <LocaleInjector />
            <ModalsChildren />
            {children}
        </EventManagerProvider>
    );
};

StandardPrivateApp.propTypes = {
    onLogout: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    locales: PropTypes.object,
    preloadModels: PropTypes.array,
    eventModels: PropTypes.array
};

export default StandardPrivateApp;
