import React, { useEffect, useState } from 'react';
import { c } from 'ttag';

import { Calendar, CalendarSettings } from 'proton-shared/lib/interfaces/calendar';
import { noop } from 'proton-shared/lib/helpers/function';

import { getActiveAddresses } from 'proton-shared/lib/helpers/address';
import { CalendarCreateData } from 'proton-shared/lib/interfaces/calendar/Api';
import { getPrimaryKey } from 'proton-shared/lib/keys';
import { createCalendar, updateCalendar, updateCalendarSettings } from 'proton-shared/lib/api/calendars';
import { loadModels } from 'proton-shared/lib/models/helper';
import { CalendarsModel } from 'proton-shared/lib/models';
import { isURL } from 'proton-shared/lib/helpers/validators';
import { setupCalendarKey } from '../../keys/calendar';
import {
    getCalendarModel,
    getCalendarPayload,
    getCalendarSettingsPayload,
    getDefaultModel,
} from '../calendarModal/calendarModalState';
import { FormModal, InputFieldTwo, Loader } from '../../../components';
import {
    useApi,
    useCache,
    useEventManager,
    useGetAddresses,
    useGetAddressKeys,
    useGetCalendarBootstrap,
    useLoading,
    useNotifications,
} from '../../../hooks';
import { GenericError } from '../../error';
import { useCalendarModelEventManager } from '../../eventManager';
import { classnames } from '../../../helpers';

const CALENDAR_URL_MAX_LENGTH = 10000;

interface Props {
    calendar?: Calendar;
    onClose?: () => void;
}

const SubscribeCalendarModal = ({ calendar: initialCalendar, ...rest }: Props) => {
    const [calendar, setCalendar] = useState(initialCalendar);
    const [calendarURL, setCalendarURL] = useState('');
    const [model, setModel] = useState(() => getDefaultModel(false));
    const [error, setError] = useState(false);

    const [loadingAction, withLoadingAction] = useLoading();
    const [loadingSetup, withLoading] = useLoading(true);

    const api = useApi();
    const { call } = useEventManager();
    const { call: calendarCall } = useCalendarModelEventManager();
    const cache = useCache();
    const getAddressKeys = useGetAddressKeys();
    const getCalendarBootstrap = useGetCalendarBootstrap();
    const { createNotification } = useNotifications();
    const getAddresses = useGetAddresses();

    const isURLValid = isURL(calendarURL);

    // TODO: consider extracting creating/updating logicfrom here and CalendarModal to a hook
    useEffect(() => {
        const initializeEmptyCalendar = async () => {
            const activeAdresses = getActiveAddresses(await getAddresses());
            if (!activeAdresses.length) {
                setError(true);
                return createNotification({ text: c('Error').t`No valid address found`, type: 'error' });
            }

            setModel((prev) => ({
                ...prev,
                addressID: activeAdresses[0].ID,
                addressOptions: activeAdresses.map(({ ID, Email = '' }) => ({ value: ID, text: Email })),
            }));
        };

        const initializeCalendar = async () => {
            if (!initialCalendar) {
                throw new Error('No initial calendar');
            }

            const [{ Members, CalendarSettings }, Addresses] = await Promise.all([
                getCalendarBootstrap(initialCalendar.ID),
                getAddresses(),
            ]);

            const [{ Email: memberEmail } = { Email: '' }] = Members;
            const { ID: AddressID } = Addresses.find(({ Email }) => memberEmail === Email) || {};

            if (!AddressID) {
                setError(true);
                return createNotification({ text: c('Error').t`No valid address found`, type: 'error' });
            }

            setModel((prev) => ({
                ...prev,
                ...getCalendarModel({ Calendar: initialCalendar, CalendarSettings, Addresses, AddressID }),
            }));
        };

        const promise = initialCalendar ? initializeCalendar() : initializeEmptyCalendar();

        withLoading(
            promise.catch(() => {
                setError(true);
            })
        );
    }, []);

    const handleCreateCalendar = async (
        addressID: string,
        calendarPayload: CalendarCreateData,
        calendarSettingsPayload: Partial<CalendarSettings>
    ) => {
        const [addresses, addressKeys] = await Promise.all([getAddresses(), getAddressKeys(addressID)]);

        const { privateKey: primaryAddressKey } = getPrimaryKey(addressKeys) || {};
        if (!primaryAddressKey) {
            createNotification({ text: c('Error').t`Primary address key is not decrypted.`, type: 'error' });
            setError(true);
            throw new Error('Missing primary key');
        }

        const {
            Calendar,
            Calendar: { ID: newCalendarID },
        } = await api<{ Calendar: Calendar }>(
            createCalendar({
                ...calendarPayload,
                AddressID: addressID,
            })
        );

        await setupCalendarKey({
            api,
            calendarID: newCalendarID,
            addresses,
            getAddressKeys,
        }).catch((e: Error) => {
            // Hard failure if the keys fail to setup. Force the user to reload.
            setError(true);
            throw e;
        });

        // Set the calendar in case one of the following calls fails so that it ends up in the update function after this.
        setCalendar(Calendar);

        await api(updateCalendarSettings(newCalendarID, calendarSettingsPayload));

        // Refresh the calendar model in order to ensure flags are correct
        await loadModels([CalendarsModel], { api, cache, useCache: false });
        await call();

        rest.onClose?.();

        createNotification({ text: c('Success').t`Calendar created. It might take a few minutes to sync.` });
    };

    const handleUpdateCalendar = async (
        calendar: Calendar,
        calendarPayload: Partial<Calendar>,
        calendarSettingsPayload: Partial<CalendarSettings>
    ) => {
        const calendarID = calendar.ID;
        await Promise.all([
            api(updateCalendar(calendarID, calendarPayload)),
            api(updateCalendarSettings(calendarID, calendarSettingsPayload)),
        ]);
        // Case: Calendar has been created, and keys have been setup, but one of the calendar settings call failed in the creation.
        // Here we are in create -> edit mode. So we have to fetch the calendar model again.
        if (!initialCalendar) {
            await loadModels([CalendarsModel], { api, cache, useCache: false });
        }
        await call();
        await calendarCall([calendarID]);

        rest.onClose?.();

        createNotification({ text: c('Success').t`Calendar updated` });
    };

    const handleProcessCalendar = async () => {
        const formattedModel = {
            ...model,
            name: calendarURL.substring(0, 99),
            url: calendarURL,
        };
        const calendarPayload = getCalendarPayload(formattedModel);
        const calendarSettingsPayload = getCalendarSettingsPayload(formattedModel);

        if (calendar) {
            return handleUpdateCalendar(calendar, calendarPayload, calendarSettingsPayload);
        }

        return handleCreateCalendar(formattedModel.addressID, calendarPayload, calendarSettingsPayload);
    };

    const { length: calendarURLLength } = calendarURL;
    const isURLMaxLength = calendarURLLength === CALENDAR_URL_MAX_LENGTH;

    const { ...modalProps } = (() => {
        if (error) {
            return {
                title: c('Title').t`Error`,
                submit: c('Action').t`Close`,
                hasClose: false,
                section: <GenericError />,
                onSubmit() {
                    window.location.reload();
                },
            };
        }

        const isEdit = !!initialCalendar;
        const loading = loadingSetup || loadingAction;

        return {
            title: isEdit ? c('Title').t`Update calendar` : c('Title').t`Subscribe to calendar`,
            submit: isEdit ? c('Action').t`Update` : c(`Action`).t`Subscribe`,
            loading,
            hasClose: true,
            submitProps: {
                disabled: !calendarURL || !isURLValid,
            },
            onSubmit: () => {
                void withLoadingAction(handleProcessCalendar());
            },
        };
    })();

    return (
        <FormModal className="modal--shorter-labels w100" onClose={noop} {...modalProps} {...rest}>
            {loadingSetup ? (
                <Loader />
            ) : (
                <>
                    <p>{c('Subscribe to calendar modal')
                        .t`You can subscribe to someone else's calendar by pasting its URL below. This will give you access to a read-only version of this calendar.`}</p>
                    <InputFieldTwo
                        autoFocus
                        hint={
                            <span className={classnames([isURLMaxLength && 'color-warning'])}>
                                {calendarURLLength}/{CALENDAR_URL_MAX_LENGTH}
                            </span>
                        }
                        maxLength={CALENDAR_URL_MAX_LENGTH}
                        label={c('Subscribe to calendar modal').t`Calendar URL`}
                        value={calendarURL}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCalendarURL(e.target.value)}
                    />
                </>
            )}
        </FormModal>
    );
};

export default SubscribeCalendarModal;
