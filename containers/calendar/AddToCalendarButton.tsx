import { noop } from 'proton-shared/lib/helpers/function';
import { CalendarWidgetData, VcalVeventComponent } from 'proton-shared/lib/interfaces/calendar';
import React, { useCallback } from 'react';
import { c } from 'ttag';
import { processInBatches } from 'proton-shared/lib/calendar/import/encryptAndSubmit';
import { Button } from '../../components';
import { useApi, useLoading } from '../../hooks';

interface Props {
    events: VcalVeventComponent[];
    calendarData?: CalendarWidgetData;
    onSuccess: () => void;
    className?: string;
}

const AddToCalendarButton = ({ events, calendarData, onSuccess, className }: Props) => {
    const api = useApi();
    const [loading, withLoading] = useLoading();

    const { calendar, isCalendarDisabled, calendarKeys, memberID, addressKeys } = calendarData || {};
    const disabled = !calendar || isCalendarDisabled || !calendarKeys || !memberID || !addressKeys;

    const handleAdd = useCallback(async () => {
        if (!calendar || isCalendarDisabled || !calendarKeys || !memberID || !addressKeys) {
            return noop();
        }
        await processInBatches({
            events,
            api,
            memberID,
            addressKeys,
            calendarID: calendar.ID,
            calendarKeys,
        });
        onSuccess();
    }, [events, api, calendar, memberID, addressKeys, calendar]);

    const importText = c('Action').t`Add to ProtonCalendar`;

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
