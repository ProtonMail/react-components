import React from 'react';
import { c, msgid } from 'ttag';

import { ExportCalendarModel } from 'proton-shared/lib/interfaces/calendar';

import { Alert, DynamicProgress } from '../../../components';

interface Props {
    model: ExportCalendarModel;
}

const ExportSummaryModalContent = ({ model }: Props) => {
    const { totalProcessed, totalToProcess } = model;
    const isSuccess = totalProcessed.length === totalToProcess;
    const isPartialSuccess = totalProcessed.length > 0 && !isSuccess;

    const alertMessage = isSuccess
        ? c('Export calendar').ngettext(
              msgid`Event successfully exported. The exported event will now appear in your calendar.`,
              `Events successfully exported. The exported events will now appear in your calendar.`,
              totalProcessed.length
          )
        : isPartialSuccess
        ? c('Export calendar')
              .t`An error occurred while decrypting and adding your events. ${totalProcessed.length} out of ${totalToProcess} events successfully exported.`
        : c('Export calendar').ngettext(
              msgid`An error occurred while decrypting and adding your event. No event could be exported.`,
              `An error occurred while decrypting and adding your events. No event could be exported.`,
              totalToProcess
          );
    const displayMessage = c('Export calendar').ngettext(
        msgid`${totalProcessed.length}/${totalToProcess} event decrypted and added to your calendar`,
        `${totalProcessed.length}/${totalToProcess} events decrypted and added to your calendar`,
        totalToProcess
    );

    return (
        <>
            <Alert type={isSuccess ? 'info' : isPartialSuccess ? 'warning' : 'error'}>{alertMessage}</Alert>
            <DynamicProgress
                id="progress-export-calendar"
                value={totalProcessed.length}
                display={displayMessage}
                max={totalToProcess}
                loading={false}
                success={isSuccess}
                partialSuccess={isPartialSuccess}
            />
        </>
    );
};

export default ExportSummaryModalContent;
