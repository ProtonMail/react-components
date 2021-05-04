import React from 'react';
import { c, msgid } from 'ttag';

import { EXPORT_ERRORS, EXPORT_EVENT_ERRORS, ExportCalendarModel } from 'proton-shared/lib/interfaces/calendar';

import { SimpleMap } from 'proton-shared/lib/interfaces';
import { Alert, Bordered, Details, DynamicProgress, Summary } from '../../../components';

interface Props {
    model: ExportCalendarModel;
}

const ExportSummaryModalContent = ({ model }: Props) => {
    const { totalProcessed, totalToProcess, error } = model;
    const isSuccess = totalProcessed.length === totalToProcess && error === undefined;
    const isPartialSuccess = totalProcessed.length > 0 && !isSuccess;

    const displayMessage = c('Export calendar').ngettext(
        msgid`${totalProcessed.length}/${totalToProcess} event exported`,
        `${totalProcessed.length}/${totalToProcess} events exported`,
        totalToProcess
    );

    const { exportErrors } = model;
    const passwordResetErrors = exportErrors.filter(
        (exportError) => exportError[1] === EXPORT_EVENT_ERRORS.PASSWORD_RESET
    );
    const hasMultiplePasswordResetErrors = passwordResetErrors.length > 1;
    const errorsWithoutPasswordReset = hasMultiplePasswordResetErrors
        ? exportErrors.filter((exportError) => exportError[1] !== EXPORT_EVENT_ERRORS.PASSWORD_RESET)
        : exportErrors;
    const filteredErrors = hasMultiplePasswordResetErrors
        ? [...errorsWithoutPasswordReset, ['', EXPORT_EVENT_ERRORS.PASSWORD_RESET]]
        : exportErrors;
    const hasOnlyPasswordResetErrors = passwordResetErrors.length === exportErrors.length;
    const errorMessagesMap: SimpleMap<string> = {
        [EXPORT_EVENT_ERRORS.DECRYPTION_ERROR]: c('Export calendar').t`Error decrypting event`,
        [EXPORT_EVENT_ERRORS.PASSWORD_RESET]: hasMultiplePasswordResetErrors
            ? c('Export calendar').t`Password reset - multiple events cannot be decrypted`
            : c('Export calendar').t`Password reset - event cannot be decrypted`,
    };

    const getAlertMessage = () => {
        if (isSuccess) {
            return c('Export calendar').t`Calendar successfully exported. You can now save the ICS file.`;
        }

        if (isPartialSuccess) {
            if (hasOnlyPasswordResetErrors) {
                return (
                    <>
                        <div>
                            {c('Export calendar')
                                .t`Due to a password reset, some events cannot be decrypted and exported.`}
                        </div>
                        <div>
                            {c('Export calendar')
                                .t`You can save an ICS file of the events that were successfully exported.`}
                        </div>
                        <div>
                            <a
                                href="https://protonmail.com/blog/"
                                target="_blank"
                                rel="noreferrer noopener nofollow"
                            >{c('Export calendar').t`Learn how to restore encrypted events with old password`}</a>
                        </div>
                    </>
                );
            }

            return (
                <>
                    <div>{c('Export calendar').t`Some events could not be exported.`}</div>
                    <div>{c('Export calendar')
                        .t`You can save an ICS file of the events that were successfully exported.`}</div>
                </>
            );
        }

        if (model.error === EXPORT_ERRORS.NETWORK_ERROR) {
            return c('Export calendar')
                .t`The internet connection was interrupted, causing the export process to fail. Please try again.`;
        }

        return c('Export calendar').t`None of the events could be exported.`;
    };

    return (
        <>
            <Alert type={isSuccess ? 'info' : isPartialSuccess ? 'warning' : 'error'}>{getAlertMessage()}</Alert>
            <DynamicProgress
                id="progress-export-calendar"
                value={totalProcessed.length}
                display={displayMessage}
                max={totalToProcess}
                loading={false}
                success={isSuccess}
                partialSuccess={isPartialSuccess}
            />
            {!!filteredErrors.length && (
                <Details>
                    <Summary>{c('Exporting errors summary').t`Details about events that cannot be exported`}</Summary>
                    <Bordered>
                        {filteredErrors.map(([details, error], index) => (
                            <div key={index}>
                                {details && <span>{details}: </span>}
                                <span className="color-danger">{errorMessagesMap[error]}</span>
                            </div>
                        ))}
                    </Bordered>
                </Details>
            )}
        </>
    );
};

export default ExportSummaryModalContent;
