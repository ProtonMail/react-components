import { getPublicLinks } from 'proton-shared/lib/api/calendars';
import {
    getIsCalendarUrlEventManagerCreate,
    getIsCalendarUrlEventManagerDelete,
    getIsCalendarUrlEventManagerUpdate,
    transformLinkFromAPI,
    transformLinksFromAPI,
} from 'proton-shared/lib/calendar/shareUrl/helpers';
import { EVENT_ACTIONS } from 'proton-shared/lib/constants';
import { updateItem } from 'proton-shared/lib/helpers/array';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';
import { SimpleMap } from 'proton-shared/lib/interfaces';
import { Calendar, CalendarLink, CalendarUrl, CalendarUrlsResponse } from 'proton-shared/lib/interfaces/calendar';
import {
    CalendarEventManager,
    CalendarUrlEventManager,
    CalendarUrlEventManagerDelete,
} from 'proton-shared/lib/interfaces/calendar/EventManager';
import { useEffect, useMemo, useState } from 'react';
import { useApi, useEventManager, useGetCalendarInfo, useLoading, useNotifications } from '../../../hooks';
import { useCalendarModelEventManager } from '../../eventManager';

const useCalendarShareUrls = (calendars: Calendar[]) => {
    const api = useApi();
    const { createNotification } = useNotifications();
    const getCalendarInfo = useGetCalendarInfo();
    const { subscribe: standardSubscribe } = useEventManager();
    const { subscribe: calendarSubscribe } = useCalendarModelEventManager();

    const [linksMap, setLinksMap] = useState<SimpleMap<CalendarLink[]>>({});
    const [loading, withLoading] = useLoading(true);
    const calendarIDs = useMemo(() => calendars.map(({ ID }) => ID), [calendars]);

    const handleError = ({ message }: Error) => createNotification({ type: 'error', text: message });

    const handleDeleteCalendar = (calendarID: string) => {
        setLinksMap((linksMap) => {
            const newMap = { ...linksMap };
            delete newMap[calendarID];
            return newMap;
        });
    };

    const handleDeleteLink = ({ ID }: CalendarUrlEventManagerDelete) => {
        setLinksMap((linksMap) => {
            return Object.fromEntries(
                Object.entries(linksMap).map(([calendarID, links]) => {
                    const newLinks = links?.filter(({ CalendarUrlID }) => CalendarUrlID !== ID);
                    return [calendarID, newLinks];
                })
            );
        });
    };

    const handleAddOrUpdateLink = async (calendarUrl: CalendarUrl) => {
        const { CalendarID } = calendarUrl;
        const calendar = calendars.find(({ ID }) => ID === CalendarID);
        if (!calendar) {
            return;
        }
        const link = await transformLinkFromAPI({
            calendarUrl,
            calendar,
            getCalendarInfo,
            onError: handleError,
        });
        setLinksMap((linksMap) => {
            const previousLinks = linksMap[CalendarID] || [];
            const linkIndex = previousLinks.findIndex(
                ({ CalendarUrlID }) => CalendarUrlID === calendarUrl.CalendarUrlID
            );
            const newLinks = linkIndex === -1 ? [...previousLinks, link] : updateItem(previousLinks, linkIndex, link);
            return {
                ...linksMap,
                [CalendarID]: newLinks,
            };
        });
    };

    // load links
    useEffect(() => {
        const getAllLinks = async () => {
            const map: SimpleMap<CalendarLink[]> = {};
            await Promise.all(
                calendars.map(async (calendar) => {
                    const calendarID = calendar.ID;
                    try {
                        const { CalendarUrls } = await api<CalendarUrlsResponse>(getPublicLinks(calendarID));
                        map[calendarID] = await transformLinksFromAPI({
                            calendarUrls: CalendarUrls,
                            calendar,
                            getCalendarInfo,
                            onError: handleError,
                        });
                    } catch (e) {
                        handleError(e);
                    }
                })
            );
            setLinksMap(map);
        };
        withLoading(getAllLinks());
    }, []);

    // subscribe to general event loop
    useEffect(() => {
        return standardSubscribe(({ Calendars = [] }: { Calendars?: CalendarEventManager[] }) => {
            Calendars.forEach(({ ID, Action }) => {
                if (Action === EVENT_ACTIONS.DELETE) {
                    handleDeleteCalendar(ID);
                }
            });
        });
    }, []);

    // subscribe to calendar event loop
    useEffect(() => {
        return calendarSubscribe(calendarIDs, ({ CalendarURL = [] }: { CalendarURL?: CalendarUrlEventManager[] }) => {
            CalendarURL.forEach((CalendarUrlChange) => {
                if (getIsCalendarUrlEventManagerDelete(CalendarUrlChange)) {
                    handleDeleteLink(CalendarUrlChange);
                }
                if (
                    getIsCalendarUrlEventManagerCreate(CalendarUrlChange) ||
                    getIsCalendarUrlEventManagerUpdate(CalendarUrlChange)
                ) {
                    handleAddOrUpdateLink(CalendarUrlChange.CalendarUrl);
                }
            });
        });
    }, [calendarIDs]);

    return {
        links: Object.values(linksMap).filter(isTruthy).flat(),
        isLoadingLinks: loading,
    };
};

export default useCalendarShareUrls;
