import { CALENDAR_APP_NAME } from 'proton-shared/lib/calendar/constants';
import { API_CODES } from 'proton-shared/lib/constants';
import { noop } from 'proton-shared/lib/helpers/function';
import {
    CalendarWidgetData,
    ImportErrorData,
    SavedImportData,
    VcalVeventComponent,
} from 'proton-shared/lib/interfaces/calendar';
import React, { useCallback } from 'react';
import { c } from 'ttag';
import { processInBatches } from 'proton-shared/lib/calendar/import/encryptAndSubmit';
import { Button } from '../../components';
import { useApi, useLoading } from '../../hooks';

interface Props {
    events: VcalVeventComponent[];
    calendarData?: CalendarWidgetData;
    onSuccess: (data: SavedImportData[]) => void;
    onError: (data: ImportErrorData[]) => void;
    className?: string;
}

const AddToCalendarButton = ({ events, calendarData, onSuccess, onError, className }: Props) => {
    const api = useApi();
    const [loading, withLoading] = useLoading();

    const { calendar, isCalendarDisabled, calendarKeys, memberID, addressKeys } = calendarData || {};
    const disabled = !calendar || isCalendarDisabled || !calendarKeys || !memberID || !addressKeys;

    const handleAdd = useCallback(async () => {
        if (!calendar || isCalendarDisabled || !calendarKeys || !memberID || !addressKeys) {
            return noop();
        }
        const encryptedEvents = await processInBatches({
            events,
            api,
            memberID,
            addressKeys,
            calendarID: calendar.ID,
            calendarKeys,
        });
        const { successData, errorData } = encryptedEvents.reduce<{
            successData: SavedImportData[];
            errorData: ImportErrorData[];
        }>(
            (acc, { component, response }) => {
                const {
                    Response: { Code, Event, Error },
                } = response;
                if (Code === API_CODES.SINGLE_SUCCESS && Event) {
                    acc.successData.push({ savedVevent: component, savedEvent: Event });
                } else {
                    acc.errorData.push({ vevent: component, error: Error || 'Unknown error' });
                }
                return acc;
            },
            { successData: [], errorData: [] }
        );
        if (successData.length) {
            onSuccess(successData);
        }
        if (errorData.length) {
            onError(errorData);
        }
    }, [events, api, calendar, memberID, addressKeys, calendar]);

    const importText = c('Action').t`Add to ${CALENDAR_APP_NAME}`;

    return (
        <Button
            className={className}
            color="weak"
            onClick={() => withLoading(handleAdd())}
            disabled={disabled}
            loading={loading}
            title={importText}
        >
            {importText}
        </Button>
    );
};

export default AddToCalendarButton;
