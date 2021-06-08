import {
    MAX_CALENDARS_PER_FREE_USER,
    MAX_CALENDARS_PER_USER,
    MAX_SUBSCRIBED_CALENDARS_PER_USER,
} from 'proton-shared/lib/calendar/constants';
import React, { useState } from 'react';
import { c, msgid } from 'ttag';
import { removeCalendar, updateCalendarUserSettings } from 'proton-shared/lib/api/calendars';
import { Calendar, CalendarWithPossibleSubscriptionParameters } from 'proton-shared/lib/interfaces/calendar';
import { Address, UserModel } from 'proton-shared/lib/interfaces';

import { useApi, useEventManager, useModals, useNotifications } from '../../../hooks';
import {
    Alert,
    ButtonLike,
    Card,
    CircleLoader,
    ConfirmModal,
    ErrorButton,
    PrimaryButton,
    SettingsLink,
} from '../../../components';

import { SettingsParagraph, SettingsSection } from '../../account';

import CalendarsTable from './CalendarsTable';
import { CalendarModal } from '../calendarModal';
import { ExportModal } from '../exportModal';
import SubscribeCalendarModal from '../subscribeCalendarModal/SubscribeCalendarModal';
import useGetCalendarsWithSubscribe from '../hooks/useGetCalendarsWithSubscribe';

interface Props {
    activeAddresses: Address[];
    calendars: Calendar[];
    disabledCalendars: Calendar[];
    activeCalendars: Calendar[];
    defaultCalendar?: Calendar;
    user: UserModel;
    isOtherCalendarSection?: boolean;
}
const CalendarsSection = ({
    activeAddresses,
    calendars: normalCalendars = [],
    defaultCalendar,
    disabledCalendars = [],
    activeCalendars = [],
    user,
    isOtherCalendarSection = false,
}: Props) => {
    const api = useApi();
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const { createModal } = useModals();
    const [loadingMap, setLoadingMap] = useState({});
    const enhancedCalendars = useGetCalendarsWithSubscribe(normalCalendars, isOtherCalendarSection);

    const defaultCalendarID = defaultCalendar?.ID;
    const hasDisabledCalendar = disabledCalendars.length > 0;

    const handleCreate = () => {
        if (isOtherCalendarSection) {
            return createModal(<SubscribeCalendarModal />);
        }

        return createModal(<CalendarModal activeCalendars={activeCalendars} defaultCalendarID={defaultCalendarID} />);
    };

    const handleEdit = (calendar: CalendarWithPossibleSubscriptionParameters) => {
        return createModal(<CalendarModal calendar={calendar} />);
    };

    const handleSetDefault = async (calendarID: string) => {
        try {
            setLoadingMap((old) => ({ ...old, [calendarID]: true }));
            await api(updateCalendarUserSettings({ DefaultCalendarID: calendarID }));
            await call();
            createNotification({ text: c('Success').t`Default calendar updated` });
        } finally {
            setLoadingMap((old) => ({ ...old, [calendarID]: false }));
        }
    };

    const handleDelete = async ({ ID }: CalendarWithPossibleSubscriptionParameters) => {
        const isDeleteDefaultCalendar = ID === defaultCalendarID;
        const firstRemainingCalendar = activeCalendars.find(({ ID: calendarID }) => calendarID !== ID);

        // If deleting the default calendar, the new calendar to make default is either the first active calendar or null if there is none.
        const newDefaultCalendarID = isDeleteDefaultCalendar
            ? (firstRemainingCalendar && firstRemainingCalendar.ID) || null
            : undefined;

        const title = isOtherCalendarSection ? c('Title').t`Unsubscribe from calendar` : c('Title').t`Delete calendar`;
        const confirmText = isOtherCalendarSection ? c('Action').t`Unsubscribe` : c('Action').t`Delete`;
        const alertText = isOtherCalendarSection
            ? c('Info').t`The calendar will be deleted and won’t be synchronised anymore with the link provided.`
            : c('Info').t`Are you sure you want to delete this calendar?`;

        await new Promise<void>((resolve, reject) => {
            const calendarName = firstRemainingCalendar ? (
                <span key="calendar-name" className="text-break">
                    {firstRemainingCalendar.Name}
                </span>
            ) : (
                ''
            );
            createModal(
                <ConfirmModal
                    title={title}
                    confirm={<ErrorButton type="submit">{confirmText}</ErrorButton>}
                    onClose={reject}
                    onConfirm={resolve}
                >
                    <Alert type="error">{alertText}</Alert>
                    {isDeleteDefaultCalendar && firstRemainingCalendar && (
                        <Alert type="warning">{c('Info').jt`${calendarName} will be set as default calendar.`}</Alert>
                    )}
                </ConfirmModal>
            );
        });
        try {
            setLoadingMap((old) => ({
                ...old,
                [newDefaultCalendarID || '']: true,
                [ID]: true,
            }));
            await api(removeCalendar(ID));
            // null is a valid default calendar id
            if (newDefaultCalendarID !== undefined) {
                await api(updateCalendarUserSettings({ DefaultCalendarID: newDefaultCalendarID }));
            }
            await call();
            createNotification({ text: c('Success').t`Calendar removed` });
        } finally {
            setLoadingMap((old) => ({ ...old, [newDefaultCalendarID || '']: false, [ID]: false }));
        }
    };

    const handleExport = (calendar: Calendar) => createModal(<ExportModal calendar={calendar} />);

    const calendarsLimit = isOtherCalendarSection
        ? MAX_SUBSCRIBED_CALENDARS_PER_USER
        : user.isFree
        ? MAX_CALENDARS_PER_FREE_USER
        : MAX_CALENDARS_PER_USER;
    const isBelowLimit = normalCalendars.length < calendarsLimit;
    const canAddCalendar = activeAddresses.length > 0 && isBelowLimit && user.hasNonDelinquentScope;

    const addCalendarString = isOtherCalendarSection
        ? c('Action').t`Subscribe to calendar`
        : c('Action').t`Add calendar`;

    return (
        <SettingsSection>
            {user.isFree && !canAddCalendar && (
                <Card className="mb1">
                    <div className="flex flex-nowrap flex-align-items-center">
                        <p className="flex-item-fluid mt0 mb0 pr2">
                            {c('Upgrade notice').ngettext(
                                msgid`Upgrade to a paid plan to create up to ${calendarsLimit} calendar, allowing you to make calendars for work, to share with friends, and just for yourself.`,
                                `Upgrade to a paid plan to create up to ${calendarsLimit} calendars, allowing you to make calendars for work, to share with friends, and just for yourself.`,
                                calendarsLimit
                            )}
                        </p>
                        <ButtonLike as={SettingsLink} path="/dashboard" color="norm" shape="solid" size="small">
                            {c('Action').t`Upgrade`}
                        </ButtonLike>
                    </div>
                </Card>
            )}
            {!user.isFree && !canAddCalendar && (
                <Alert type="warning">
                    {c('Calendar limit warning').t`You have reached the maximum number of ${calendarsLimit} calendars.`}
                </Alert>
            )}
            <div className="mb1">
                <PrimaryButton
                    data-test-id="calendar-setting-page:add-calendar"
                    disabled={!canAddCalendar}
                    onClick={handleCreate}
                >
                    {addCalendarString}
                </PrimaryButton>
            </div>
            {hasDisabledCalendar ? (
                <SettingsParagraph>
                    {c('Disabled calendar')
                        .t`A calendar is marked as disabled when it is linked to a disabled email address or a free @pm.me address. You can still access your disabled calendar and view events in read-only mode or delete them. You can enable the calendar by re-enabling the email address or upgrading your plan to use @pm.me addresses.`}
                </SettingsParagraph>
            ) : null}
            {!enhancedCalendars ? (
                <div className="flex flex-justify-center">
                    <CircleLoader />
                </div>
            ) : (
                !!enhancedCalendars.length && (
                    <CalendarsTable
                        calendars={enhancedCalendars}
                        defaultCalendarID={defaultCalendarID}
                        user={user}
                        onEdit={handleEdit}
                        onSetDefault={handleSetDefault}
                        onDelete={handleDelete}
                        onExport={handleExport}
                        loadingMap={loadingMap}
                    />
                )
            )}
        </SettingsSection>
    );
};

export default CalendarsSection;
