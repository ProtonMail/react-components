import { ICAL_ATTENDEE_STATUS } from 'proton-shared/lib/calendar/constants';
import { getProdId } from 'proton-shared/lib/calendar/vcalHelper';
import { pick } from 'proton-shared/lib/helpers/object';
import { wait } from 'proton-shared/lib/helpers/promise';
import {
    CalendarEvent,
    CalendarWidgetData,
    InviteActions,
    Participant,
    SavedInviteData,
} from 'proton-shared/lib/interfaces/calendar';
import { VcalVeventComponent } from 'proton-shared/lib/interfaces/calendar/VcalModel';
import { getParticipantHasAddressID, createReplyIcs } from 'proton-shared/lib/calendar/integration/invite';
import {
    createCalendarEventFromInvitation,
    updateCalendarEventFromInvitation,
} from 'proton-shared/lib/calendar/integration/inviteApi';
import { useCallback } from 'react';
import { useApi, useConfig } from './index';
import useSendIcs from './useSendIcs';

interface Args {
    veventApi?: VcalVeventComponent;
    veventIcs?: VcalVeventComponent;
    attendee?: Participant;
    organizer?: Participant;
    subject: string;
    calendarData?: CalendarWidgetData;
    calendarEvent?: CalendarEvent;
    onEmailSuccess: () => void;
    onEmailError: (error?: Error) => void;
    onCreateEventSuccess: () => void;
    onUpdateEventSuccess: () => void;
    onCreateEventError: (partstat: ICAL_ATTENDEE_STATUS, error?: Error) => void;
    onUpdateEventError: (partstat: ICAL_ATTENDEE_STATUS, error?: Error) => void;
    onSuccess: (savedData: SavedInviteData) => void;
    onUnexpectedError: () => void;
}
const useInviteButtons = ({
    veventApi,
    veventIcs,
    attendee,
    organizer,
    subject,
    calendarData,
    calendarEvent,
    onEmailSuccess,
    onEmailError,
    onCreateEventSuccess,
    onUpdateEventSuccess,
    onSuccess,
    onCreateEventError,
    onUpdateEventError,
    onUnexpectedError,
}: Args): InviteActions => {
    const api = useApi();
    const sendIcs = useSendIcs();
    const config = useConfig();

    // Returns true if the operation is succesful
    const sendReplyEmail = useCallback(
        async (partstat: ICAL_ATTENDEE_STATUS) => {
            const vevent = veventApi || veventIcs;
            if (!vevent || !attendee || !getParticipantHasAddressID(attendee) || !organizer || !config) {
                onUnexpectedError();
                return false;
            }
            try {
                const prodId = getProdId(config);
                const ics = createReplyIcs({
                    prodId,
                    vevent: pick(vevent, ['uid', 'dtstart', 'dtend', 'sequence', 'recurrence-id']),
                    attendee,
                    partstat,
                    organizer,
                });
                await sendIcs({
                    ics,
                    addressID: attendee.addressID,
                    from: { Address: attendee.emailAddress, Name: attendee.displayName || attendee.emailAddress },
                    to: [{ Address: organizer.emailAddress, Name: organizer.name }],
                    subject,
                });
                onEmailSuccess();
                return true;
            } catch (error) {
                onEmailError(error);
                return false;
            }
        },
        [veventApi, veventIcs, attendee, organizer, config, onEmailSuccess, onEmailError]
    );

    const createCalendarEvent = useCallback(
        async (partstat: ICAL_ATTENDEE_STATUS) => {
            if (!attendee || !veventIcs || !organizer) {
                onUnexpectedError();
                return;
            }
            try {
                const {
                    savedEvent,
                    savedVevent,
                    savedAttendee,
                    savedOrganizer,
                } = await createCalendarEventFromInvitation({
                    vevent: veventIcs,
                    attendee,
                    organizer,
                    partstat,
                    api,
                    calendarData,
                });
                onCreateEventSuccess();
                return { savedEvent, savedVevent, savedAttendee, savedOrganizer };
            } catch (error) {
                onCreateEventError(partstat, error);
            }
        },
        [veventIcs, attendee, organizer, api, calendarData]
    );

    const updateCalendarEvent = useCallback(
        async (partstat: ICAL_ATTENDEE_STATUS) => {
            if (!attendee || !veventApi || !calendarEvent || !organizer) {
                onUnexpectedError();
                return;
            }
            try {
                const {
                    savedEvent,
                    savedVevent,
                    savedAttendee,
                    savedOrganizer,
                } = await updateCalendarEventFromInvitation({
                    veventIcs,
                    veventApi,
                    calendarEvent,
                    attendee,
                    organizer,
                    partstat,
                    oldPartstat: attendee.partstat,
                    api,
                    calendarData,
                });
                onUpdateEventSuccess();
                return { savedEvent, savedVevent, savedAttendee, savedOrganizer };
            } catch (error) {
                onUpdateEventError(partstat, error);
            }
        },
        [veventApi, veventIcs, attendee, organizer, api, calendarData, calendarEvent]
    );

    const answerInvitation = useCallback(
        async (partstat: ICAL_ATTENDEE_STATUS) => {
            const sent = await sendReplyEmail(partstat);
            if (!sent) {
                return;
            }
            const result = !veventApi ? await createCalendarEvent(partstat) : await updateCalendarEvent(partstat);
            if (result) {
                onSuccess(result);
            }
        },
        [sendReplyEmail, createCalendarEvent, updateCalendarEvent]
    );

    const dummyActions = {
        accept: () => wait(0),
        acceptTentatively: () => wait(0),
        decline: () => wait(0),
        retryCreateEvent: () => wait(0),
        retryUpdateEvent: () => wait(0),
    };

    if (!attendee || !organizer) {
        return dummyActions;
    }

    return {
        accept: () => answerInvitation(ICAL_ATTENDEE_STATUS.ACCEPTED),
        acceptTentatively: () => answerInvitation(ICAL_ATTENDEE_STATUS.TENTATIVE),
        decline: () => answerInvitation(ICAL_ATTENDEE_STATUS.DECLINED),
        retryCreateEvent: async (partstat: ICAL_ATTENDEE_STATUS) => {
            const result = await createCalendarEvent(partstat);
            if (result) {
                onSuccess(result);
            }
        },
        retryUpdateEvent: async (partstat: ICAL_ATTENDEE_STATUS) => {
            const result = await updateCalendarEvent(partstat);
            if (result) {
                onSuccess(result);
            }
        },
    };
};

export default useInviteButtons;
