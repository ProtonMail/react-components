import React, { useState, useEffect } from 'react';
import {
    Alert,
    ConfirmModal,
    Loader,
    Badge,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    useApi,
    useLoading,
    useModals,
    useNotifications,
} from '../..';
import { c } from 'ttag';
import { queryMailImportHistory, deleteMailImportReport } from 'proton-shared/lib/api/mailImport';

import { ImportMailReport, ImportMailReportStatus } from './interfaces';
import { Button } from '../../components/button';

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
    const { createModal } = useModals();
    const api = useApi();
    const [imports, setImports] = useState<ImportMailReport[]>([]);
    const [loading, withLoading] = useLoading();
    const [loadingActions, withLoadingActions] = useLoading();
    const { createNotification } = useNotifications();

    const fetch = async () => {
        const { Imports = [] } = await api(queryMailImportHistory());
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
        return <Loader />;
    }

    if (!imports.length) {
        return <Alert>{c('Info').t`No past imports found`}</Alert>;
    }

    const handleDelete = async (ID: string, email: string) => {
        await new Promise((resolve, reject) => {
            createModal(
                <ConfirmModal onConfirm={resolve} onClose={reject} title={c('Title').t`Delete mail import report`}>
                    <Alert type="warning">{c('Warning')
                        .t`Are you sure you want to delete ${email} mail import report?`}</Alert>
                </ConfirmModal>
            );
        });
        await api(deleteMailImportReport(ID));
        await fetch();
        createNotification({ text: c('Success').t`Import deleted` });
    };

    return (
        <Table>
            <TableHeader
                cells={[c('Title header').t`Import`, c('Title header').t`Status`, c('Title header').t`Actions`]}
            />
            <TableBody>
                {imports.map(({ Status, Email, ID, Report }, index) => {
                    return (
                        <TableRow
                            key={index}
                            cells={[
                                Email,
                                <ImportStatus key="status" status={Status} />,
                                <Button
                                    loading={loadingActions}
                                    className="pm-button--small"
                                    onClick={() => {
                                        withLoadingActions(handleDelete(ID, Email));
                                    }}
                                >{c('Action').t`Delete record`}</Button>,
                            ]}
                        />
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default PastImportsSection;
