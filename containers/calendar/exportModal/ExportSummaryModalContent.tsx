import React from 'react';
import { c, msgid } from 'ttag';

import { ExportCalendarModel } from 'proton-shared/lib/interfaces/calendar';

import ErrorDetails from './ErrorDetails';
import { Alert, DynamicProgress } from '../../../components';

interface Props {
    model: ExportCalendarModel;
}

const ExportSummaryModalContent = ({ model }: Props) => {
    const { totalProcessed, totalToProcess } = model;
    const isSuccess = totalProcessed.length === totalToProcess;
    const isPartialSuccess = totalProcessed.length > 0 && !isSuccess;

    const alertMessage = isSuccess
        ? c('Import calendar').ngettext(
              msgid`Event successfully imported. The imported event will now appear in your calendar.`,
              `Events successfully imported. The imported events will now appear in your calendar.`,
              totalProcessed.length
          )
        : isPartialSuccess
        ? c('Import calendar')
              .t`An error occurred while encrypting and adding your events. ${totalProcessed.length} out of ${totalToProcess} events successfully imported.`
        : c('Import calendar').ngettext(
              msgid`An error occurred while encrypting and adding your event. No event could be imported.`,
              `An error occurred while encrypting and adding your events. No event could be imported.`,
              totalToProcess
          );
    const displayMessage = c('Import calendar').ngettext(
        msgid`${totalProcessed.length}/${totalToProcess} event encrypted and added to your calendar`,
        `${totalProcessed.length}/${totalToProcess} events encrypted and added to your calendar`,
        totalToProcess
    );

    return (
        <>
            <Alert type={isSuccess ? 'info' : isPartialSuccess ? 'warning' : 'error'}>{alertMessage}</Alert>
            <DynamicProgress
                id="progress-import-calendar"
                value={totalProcessed.length}
                display={displayMessage}
                max={totalToProcess}
                loading={false}
                success={isSuccess}
                partialSuccess={isPartialSuccess}
            />
            <ErrorDetails errors={[]} />
        </>
    );
};

export default ExportSummaryModalContent;
