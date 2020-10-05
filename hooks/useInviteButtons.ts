import { ICAL_ATTENDEE_STATUS } from 'proton-shared/lib/calendar/constants';
import { getProdId } from 'proton-shared/lib/calendar/vcalHelper';
import { pick } from 'proton-shared/lib/helpers/object';
import { wait } from 'proton-shared/lib/helpers/promise';
import { ProtonConfig } from 'proton-shared/lib/interfaces';
import {
    VcalVeventComponent
} from 'proton-shared/lib/interfaces/calendar/VcalModel';
import {
    getParticipantHasAddressID,
    Participant,
    createReplyIcs
} from 'proton-shared/lib/calendar/integration/invite';
import { RequireSome } from 'proton-shared/lib/interfaces/utils';
import { useCallback } from 'react';
import { c } from 'ttag';
import { useApi } from './index';
import { createCalendarEventFromInvitation, updateCalendarEventFromInvitation } from '../helpers/calendar/inviteApi';
import useSendIcs from './useSendIcs';

interface Props {
    vevent: Pick<VcalVeventComponent, 'uid' | 'dtstart' | 'dtend' | 'sequence' | 'recurrence-id'>;
    attendee: Participant;
    organizer: Participant;
    subject: string;
    config: ProtonConfig;
    onSuccess: (invitationApi: RequireSome<EventInvitation, 'calendarEvent' | 'attendee'>) => void;
    onCreateEventError: (partstat: ICAL_ATTENDEE_STATUS) => void;
    onUpdateEventError: (partstat: ICAL_ATTENDEE_STATUS) => void;
    onUnexpectedError: () => void;
}
const useInviteButtons = ({
    vevent,
    attendee,
    organizer,
    subject,
    config,
    onUnexpectedError,
    onSuccess,
    onCreateEventError,
    onUpdateEventError
}: Props) => {
    const api = useApi();
    const sendIcs = useSendIcs();
    // const {
    //     isOrganizerMode,
    //     invitationIcs,
    //     invitationIcs: { attendee, organizer, vevent: veventIcs },
    //     calendarData: { calendar } = {},
    //     updateAction
    // } = model;

    const sendReplyEmail = async (partstat: ICAL_ATTENDEE_STATUS): Promise<boolean> => {
        if (!getParticipantHasAddressID(attendee) || !organizer) {
            onUnexpectedError();
            return false;
        }
        try {
            const prodId = getProdId(config);
            const ics = createReplyIcs({
                prodId,
                vevent,
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
            createNotification({
                type: 'success',
                text: c('Reply to calendar invitation').t`Answer sent`
            });
            return true;
        } catch (error) {
            if (
                error instanceof EventInvitationError &&
                error.type === EVENT_INVITATION_ERROR_TYPE.UNEXPECTED_ERROR
            ) {
                onUnexpectedError();
                return false;
            }
            createNotification({
                type: 'error',
                text: c('Reply to calendar invitation').t`Answering invitation failed`
            });
            return false;
        }
    };

    const createCalendarEvent = useCallback(
        (attendee: Participant) => {
            return async (partstat: ICAL_ATTENDEE_STATUS) => {
                try {
                    const { createdEvent, savedVevent, savedVcalAttendee } = await createCalendarEventFromInvitation({
                        partstat,
                        model,
                        api
                    });
                    createNotification({
                        type: 'success',
                        text: c('Reply to calendar invitation').t`Calendar event created`
                    });
                    const invitationToSave = {
                        vevent: savedVevent,
                        calendarEvent: createdEvent,
                        attendee: {
                            ...attendee,
                            vcalComponent: savedVcalAttendee,
                            partstat
                        },
                        timeStatus: EVENT_TIME_STATUS.FUTURE
                    };
                    onSuccess(invitationToSave);
                } catch (error) {
                    createNotification({
                        type: 'error',
                        text: c('Reply to calendar invitation').t`Creating calendar event failed`
                    });
                    if (
                        error instanceof EventInvitationError &&
                        error.type === EVENT_INVITATION_ERROR_TYPE.UNEXPECTED_ERROR
                    ) {
                        onUnexpectedError();
                        return;
                    }
                    onCreateEventError(partstat);
                }
            };
        },
        [model, api]
    );

    const updateCalendarEvent = useCallback(
        (attendee: Participant) => {
            return async (partstat: ICAL_ATTENDEE_STATUS) => {
                try {
                    const { updatedEvent, savedVevent, savedVcalAttendee } = await updateCalendarEventFromInvitation({
                        partstat,
                        model,
                        api
                    });
                    createNotification({
                        type: 'success',
                        text: c('Reply to calendar invitation').t`Calendar event updated`
                    });
                    const invitationToSave = {
                        vevent: savedVevent,
                        calendarEvent: updatedEvent,
                        attendee: {
                            ...attendee,
                            vcalComponent: savedVcalAttendee,
                            partstat
                        },
                        timeStatus: EVENT_TIME_STATUS.FUTURE
                    };
                    onSuccess(invitationToSave);
                } catch (error) {
                    createNotification({
                        type: 'error',
                        text: c('Reply to calendar invitation').t`Updating calendar event failed`
                    });
                    if (
                        error instanceof EventInvitationError &&
                        error.type === EVENT_INVITATION_ERROR_TYPE.UNEXPECTED_ERROR
                    ) {
                        onUnexpectedError();
                        return;
                    }
                    onUpdateEventError(partstat);
                }
            };
        },
        [model, api]
    );

    const answerInvitation = useCallback(
        async (partstat: ICAL_ATTENDEE_STATUS) => {
            // Send the corresponding email
            if (!attendee || !getParticipantHasAddressID(attendee) || !organizer || !calendar) {
                onUnexpectedError();
                return;
            }
            const sent = await sendReplyEmail({
                attendee,
                organizer,
                ...pick(veventIcs, ['uid', 'sequence', 'recurrence-id', 'dtstart', 'dtend'])
            })(partstat);
            if (!sent) {
                return;
            }
            if (updateAction === undefined) {
                await createCalendarEvent(attendee)(partstat);
                return;
            }
            if ([NONE, KEEP_PARTSTAT, RESET_PARTSTAT].includes(updateAction)) {
                await updateCalendarEvent(attendee)(partstat);
                return;
            }
        },
        [sendReplyEmail, sendIcs, updateAction]
    );

    const dummyButtons = {
        accept: () => wait(0),
        acceptTentatively: () => wait(0),
        decline: () => wait(0),
        retryCreateEvent: () => wait(0),
        retryUpdateEvent: () => wait(0)
    };

    if (!attendee) {
        return dummyButtons;
    }

    if (!isOrganizerMode) {
        return {
            accept: () => answerInvitation(ICAL_ATTENDEE_STATUS.ACCEPTED),
            acceptTentatively: () => answerInvitation(ICAL_ATTENDEE_STATUS.TENTATIVE),
            decline: () => answerInvitation(ICAL_ATTENDEE_STATUS.DECLINED),
            retryCreateEvent: createCalendarEvent(attendee),
            retryUpdateEvent: updateCalendarEvent(attendee)
        };
    }

    return dummyButtons;
};

export default useInviteButtons;
