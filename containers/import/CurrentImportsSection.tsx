import React, { useEffect, useState } from 'react';
import {
    SubTitle,
    Alert,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    Time,
    Loader,
    DropdownActions,
    Button,
    useApi,
    useLoading,
    useNotifications
} from 'react-components';
import { c } from 'ttag';
import { queryMailImportCurrent, resumeMailImport, cancelMailImport } from 'proton-shared/lib/api/mailImport';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';

import { ImportMail, ImportMailStatus } from './interfaces';

const CurrentImportsSection = () => {
    const api = useApi();
    const [imports, setImports] = useState<ImportMail[]>([]);
    const [loading, withLoading] = useLoading();
    const [loadingActions, withLoadingActions] = useLoading();
    const { createNotification } = useNotifications();

    const fetch = async () => {
        const { Imports = [] } = await api(queryMailImportCurrent());
        setImports(Imports);
    };

    useEffect(() => {
        withLoading(fetch());

        const intervalID = setInterval(() => {
            fetch();
        }, 30 * 1000);

        return () => {
            clearTimeout(intervalID);
        };
    }, []);

    if (loading) {
        return (
            <>
                <SubTitle>{c('Title').t`Current imports`}</SubTitle>
                <Loader />
            </>
        );
    }

    if (!imports.length) {
        return (
            <>
                <SubTitle>{c('Title').t`Current imports`}</SubTitle>
                <Alert>{c('Info').t`No ongoing import`}</Alert>
            </>
        );
    }

    const handleResume = async (importID: string) => {
        await api(resumeMailImport(importID));
        await fetch();
        createNotification({ text: c('Success').t`Import resumed` });
    };

    const handleCancel = async (importID: string) => {
        await api(cancelMailImport(importID));
        await fetch();
        createNotification({ text: c('Success').t`Import canceled` });
    };

    return (
        <>
            <SubTitle>{c('Title').t`Current imports`}</SubTitle>
            <div className="mb1">
                <Button loading={loadingActions} onClick={() => withLoadingActions(fetch())}>{c('Action')
                    .t`Refresh`}</Button>
            </div>
            <Table>
                <TableHeader
                    cells={[
                        c('Title header').t`Import`,
                        c('Title header').t`Started`,
                        c('Title header').t`Progress`,
                        c('Title header').t`Actions`
                    ]}
                />
                <TableBody>
                    {imports.map(({ ID, Email, Status, CreationTime, FolderMapping = [] }, index) => {
                        const { total, processed } = FolderMapping.reduce(
                            (acc, { Total, Processed }) => {
                                acc.total += Total;
                                acc.processed += Processed;
                                return acc;
                            },
                            { total: 0, processed: 0 }
                        );
                        const percentage = (processed * 100) / total;
                        return (
                            <TableRow
                                key={index}
                                cells={[
                                    Email,
                                    <Time key="creation" format="PPp">
                                        {CreationTime}
                                    </Time>,
                                    c('Import status').t`${
                                        isNaN(percentage) ? 0 : Math.round(percentage)
                                    }% imported...`,
                                    <DropdownActions
                                        key="actions"
                                        loading={loadingActions}
                                        className="pm-button--small"
                                        list={[
                                            Status !== ImportMailStatus.CANCELED && {
                                                text: c('Action').t`Cancel`,
                                                onClick() {
                                                    withLoadingActions(handleResume(ID));
                                                }
                                            },
                                            Status === ImportMailStatus.CANCELED && {
                                                text: c('Action').t`Resume`,
                                                onClick() {
                                                    withLoadingActions(handleCancel(ID));
                                                }
                                            }
                                        ].filter(isTruthy)}
                                    />
                                ]}
                            />
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
};

export default CurrentImportsSection;
