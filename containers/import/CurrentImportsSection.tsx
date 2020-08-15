import React, { useEffect, useState } from 'react';
import {
    Alert,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    Time,
    Loader,
    DropdownActions,
    useApi,
    useLoading,
    useNotifications,
} from '../..';
import { c } from 'ttag';
import { queryMailImport, resumeMailImport, cancelMailImport } from 'proton-shared/lib/api/mailImport';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';

import { ImportMail, ImportMailStatus } from './interfaces';

interface ImportsFromServer {
    Active: ImportMail;
    Email: string;
    ID: string;
    ImapHost: string;
    ImapPort: number;
    Sasl: string;
}

const CurrentImportsSection = () => {
    const api = useApi();
    const [imports, setImports] = useState<ImportMail[]>([]);
    const [loading, withLoading] = useLoading();
    const [loadingActions, withLoadingActions] = useLoading();
    const { createNotification } = useNotifications();

    const fetch = async () => {
        const data: { Importers: ImportsFromServer[] } = await api(queryMailImport());
        const imports = data.Importers || [];
        setImports(
            imports
                .filter((i) => i.Active)
                .map((i) => ({
                    ...i.Active,
                    ID: i.ID,
                    Email: i.Email,
                }))
        );
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
        return <Alert>{c('Info').t`No ongoing import`}</Alert>;
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
        <Table>
            <TableHeader
                cells={[
                    c('Title header').t`Import`,
                    c('Title header').t`Started`,
                    c('Title header').t`Progress`,
                    c('Title header').t`Actions`,
                ]}
            />
            <TableBody>
                {imports.map(({ ID, Email, State, CreateTime, Mapping = [] }, index) => {
                    const { total, processed } = Mapping.reduce(
                        (acc, { Total = 0, Processed = 0 }) => {
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
                                <div className="w100 ellipsis">{Email}</div>,
                                <Time key="creation" format="PPp">
                                    {CreateTime}
                                </Time>,
                                c('Import status').t`${isNaN(percentage) ? 0 : Math.round(percentage)}% imported...`,
                                <DropdownActions
                                    key="actions"
                                    loading={loadingActions}
                                    className="pm-button--small"
                                    list={[
                                        State !== ImportMailStatus.CANCELED && {
                                            text: c('Action').t`Cancel`,
                                            onClick() {
                                                withLoadingActions(handleCancel(ID));
                                            },
                                        },
                                        State === ImportMailStatus.PAUSED && {
                                            text: c('Action').t`Resume`,
                                            onClick() {
                                                withLoadingActions(handleResume(ID));
                                            },
                                        },
                                    ].filter(isTruthy)}
                                />,
                            ]}
                        />
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default CurrentImportsSection;
