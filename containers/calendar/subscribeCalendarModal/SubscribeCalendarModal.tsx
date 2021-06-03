import React, { useState } from 'react';
import { c } from 'ttag';

import { Calendar } from 'proton-shared/lib/interfaces/calendar';
import { noop } from 'proton-shared/lib/helpers/function';
import { isURL } from 'proton-shared/lib/helpers/validators';
import { getCalendarPayload, getCalendarSettingsPayload, getDefaultModel } from '../calendarModal/calendarModalState';
import { FormModal, InputFieldTwo, Loader } from '../../../components';
import { useLoading } from '../../../hooks';
import { GenericError } from '../../error';
import { classnames } from '../../../helpers';
import useGetCalendarSetup from '../hooks/useGetCalendarSetup';
import useGetCalendarActions from '../hooks/useGetCalendarActions';

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

    const isURLValid = isURL(calendarURL);

    const { error: setupError, loading: loadingSetup } = useGetCalendarSetup({ calendar: initialCalendar, setModel });
    const { handleCreateCalendar, handleUpdateCalendar } = useGetCalendarActions({
        calendar: initialCalendar,
        setCalendar,
        setError,
        onClose: rest?.onClose,
        isOtherCalendar: true,
    });

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
        if (error || setupError) {
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
                        error={calendarURL && !isURLValid && c('Error message').t`Invalid URL`}
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
