import React from 'react';
import { c } from 'ttag';
import { APPS, FEATURE_FLAGS } from 'proton-shared/lib/constants';
import { getAppName } from 'proton-shared/lib/apps/helper';
import { FormModal, AppLink, Alert } from '../../../components';

interface Props {
    onClose: () => void;
    onSubmit: () => void;
}

const CALENDAR_APP_NAME = getAppName(APPS.PROTONCALENDAR);

const CalendarDowngradeModal = ({ onSubmit, onClose, ...rest }: Props) => {
    const isSharingEnabled = FEATURE_FLAGS.includes('calendar-share-url');

    const handleSubmit = () => {
        onSubmit();
        onClose();
    };

    const linkButton = (
        <AppLink toApp={APPS.PROTONACCOUNT} to="/calendar/calendars" onClick={onClose}>
            {c('Action').t`Open ${CALENDAR_APP_NAME} settings`}
        </AppLink>
    );

    return (
        <FormModal
            title={c('Title').t`Cancel Subscription`}
            submit={c('Action').t`OK`}
            onSubmit={handleSubmit}
            onClose={onClose}
            close={null}
            {...rest}
        >
            <Alert type="warning">
                {isSharingEnabled
                    ? c('Info')
                          .jt`You must remove any additional calendar and any shared calendar links before you can cancel your subscription. ${linkButton}`
                    : c('Info')
                          .jt`You must remove any additional calendar before you can cancel your subscription. ${linkButton}`}
            </Alert>
        </FormModal>
    );
};

export default CalendarDowngradeModal;
