import React from 'react';
import { c } from 'ttag';

import { ExportCalendarModel } from 'proton-shared/lib/interfaces/calendar';

import { Alert, DynamicProgress } from '../../../components';

interface Props {
    model: ExportCalendarModel;
}

const ExportSummaryModalContent = ({ model }: Props) => {
    const { totalProcessed, totalToProcess } = model;
    const isSuccess = totalProcessed.length === totalToProcess;
    const isPartialSuccess = totalProcessed.length > 0 && !isSuccess;

    const alertMessage = isSuccess ? (
        c('Export calendar').t`Calendar successfully exported. Please save the ICS file.`
    ) : isPartialSuccess ? (
        <>
            <div>{c('Export calendar').t`Some events cannot be exported.`}</div>
            <div>{c('Export calendar').t`You can save an ICS file of the events that were successfully exported.`}</div>
        </>
    ) : (
        c('Export calendar').t`None of the events could be exported.`
    );
    const displayMessage = c('Export calendar').t`${totalProcessed.length}/${totalToProcess} events exported`;

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
