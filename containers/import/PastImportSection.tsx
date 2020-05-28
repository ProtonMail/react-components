import React, { useState, useEffect } from 'react';
import {
    SubTitle,
    Alert,
    Loader,
    Badge,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    DropdownActions,
    useApi,
    useLoading,
    useNotifications
} from 'react-components';
import { c } from 'ttag';
import { queryMailImportReport } from 'proton-shared/lib/api/mailImport';

import { ImportMailReport, ImportMailReportStatus } from './interfaces';

interface Props {
    status: ImportMailReportStatus;
}

const ImportStatus = ({ status }: Props) => {
    if (status === ImportMailReportStatus.CANCELED) {
        return <Badge type="warning">{c('Import status').t`Canceled`}</Badge>;
    }

    if (status === ImportMailReportStatus.DONE) {
        return <Badge type="success">{c('Import status').t`Completed`}</Badge>;
    }

    if (status === ImportMailReportStatus.FAILED) {
        return <Badge type="error">{c('Import status').t`Failed`}</Badge>;
    }

    return null;
};

const PastImportsSection = () => {
    const api = useApi();
    const [imports, setImports] = useState<ImportMailReport[]>([]);
    const [loading, withLoading] = useLoading();
    const [loadingActions, withLoadingActions] = useLoading();
    const { createNotification } = useNotifications();

    const fetch = async () => {
        const { Imports = [] } = await api(queryMailImportReport());
        setImports(Imports);
    };

    useEffect(() => {
        withLoading(fetch());

        const intervalID = setInterval(() => {
            fetch();
        }, 10 * 1000);

        return () => {
            clearTimeout(intervalID);
        };
    }, []);

    if (loading) {
        return (
            <>
                <SubTitle>{c('Title').t`Import history`}</SubTitle>
                <Loader />
            </>
        );
    }

    if (!imports.length) {
        return (
            <>
                <SubTitle>{c('Title').t`Import history`}</SubTitle>
                <Alert>{c('Info').t`No past imports found`}</Alert>
            </>
        );
    }

    const handleDelete = async (ID: string) => {
        // TODO
        await api(ID);
        await fetch();
        createNotification({ text: c('Success').t`Import deleted` });
    };

    return (
        <>
            <SubTitle>{c('Title').t`Import history`}</SubTitle>
            <Table>
                <TableHeader
                    cells={[c('Title header').t`Import`, c('Title header').t`Status`, c('Title header').t`Actions`]}
                />
                <TableBody>
                    {imports.map(({ Status, Email, ID }, index) => {
                        return (
                            <TableRow
                                key={index}
                                cells={[
                                    Email,
                                    <ImportStatus key="status" status={Status} />,
                                    <DropdownActions
                                        key="actions"
                                        loading={loadingActions}
                                        className="pm-button--small"
                                        list={[
                                            {
                                                text: c('Action').t`Delete`,
                                                onClick() {
                                                    withLoadingActions(handleDelete(ID));
                                                }
                                            }
                                        ]}
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

export default PastImportsSection;
