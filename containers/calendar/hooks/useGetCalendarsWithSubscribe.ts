import { useEffect, useMemo, useState } from 'react';
import {
    CalendarEventManager,
    CalendarSubscriptionEventManager,
} from 'proton-shared/lib/interfaces/calendar/EventManager';
import { EVENT_ACTIONS } from 'proton-shared/lib/constants';
import { removeItem, updateItem } from 'proton-shared/lib/helpers/array';
import { Calendar, CalendarWithPossibleSubscriptionParameters } from 'proton-shared/lib/interfaces/calendar';
import { useEventManager } from '../../../hooks';
import { useCalendarModelEventManager } from '../../eventManager';
import { useGetCalendarSubscription } from './useGetCalendarSubscription';

const useGetCalendarsWithSubscribe = (calendars: Calendar[], isOtherCalendarSection: boolean) => {
    const [enhancedCalendars, setEnhancedCalendars] = useState<CalendarWithPossibleSubscriptionParameters[]>();
    const getCalendarSubscription = useGetCalendarSubscription();

    const calendarIDs = useMemo(() => calendars.map(({ ID }) => ID), [calendars]);

    const { subscribe: standardSubscribe } = useEventManager();
    const { subscribe: calendarSubscribe } = useCalendarModelEventManager();

    const handleAddSubscribedCalendar = async (calendar: Calendar) => {
        const response = await getCalendarSubscription(calendar.ID);

        setEnhancedCalendars((prevState = []) => [
            ...prevState,
            {
                ...calendar,
                SubscriptionParameters: response.CalendarSubscription,
            },
        ]);
    };

    useEffect(() => {
        if (isOtherCalendarSection) {
            return standardSubscribe(({ Calendars = [] }: { Calendars?: CalendarEventManager[] }) => {
                Calendars.forEach(({ ID, Action, Calendar }) => {
                    if (Action === EVENT_ACTIONS.DELETE && enhancedCalendars) {
                        const index = enhancedCalendars?.findIndex((calendar) => calendar.ID === ID);
                        const newEnhancedCalendars = removeItem(enhancedCalendars, index);

                        setEnhancedCalendars(newEnhancedCalendars);
                    }

                    if (Action === EVENT_ACTIONS.CREATE) {
                        void handleAddSubscribedCalendar(Calendar);
                    }
                });
            });
        }
    }, []);

    useEffect(() => {
        if (isOtherCalendarSection) {
            return calendarSubscribe(
                calendarIDs,
                ({
                    CalendarSubscription: CalendarSubscriptionEvents = [],
                }: {
                    CalendarSubscription?: CalendarSubscriptionEventManager[];
                }) => {
                    CalendarSubscriptionEvents.forEach(({ ID, Action, CalendarSubscription }) => {
                        if (Action === EVENT_ACTIONS.UPDATE && enhancedCalendars) {
                            const index = enhancedCalendars?.findIndex((calendar) => calendar.ID === ID);
                            const newEnhancedCalendars = updateItem(enhancedCalendars, index, {
                                ...enhancedCalendars[index],
                                ...CalendarSubscription,
                            });

                            setEnhancedCalendars(newEnhancedCalendars);
                        }
                    });
                }
            );
        }
    }, [calendarIDs]);

    useEffect(() => {
        (async () => {
            if (isOtherCalendarSection) {
                const enhanced = await Promise.all(
                    calendars.map(async (calendar) => {
                        const response = await getCalendarSubscription(calendar.ID);

                        return {
                            ...calendar,
                            SubscriptionParameters: response.CalendarSubscription,
                        };
                    })
                );

                return setEnhancedCalendars(enhanced);
            }

            setEnhancedCalendars(calendars);
        })();
    }, []);

    if (!isOtherCalendarSection) {
        return calendars;
    }

    return enhancedCalendars;
};

export default useGetCalendarsWithSubscribe;
