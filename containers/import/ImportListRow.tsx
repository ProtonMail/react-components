import React from 'react';
import { format } from 'date-fns';

import humanSize from 'proton-shared/lib/helpers/humanSize';

import { TableRow } from '../../components';

import { Importer, ImportHistory } from './interfaces';

import PastImportStatus from './PastImportStatus';
import PastImportDeleteButton from './PastImportDeleteButton';
import ActiveImportRowActions from './ActiveImportRowActions';
import ActiveImportStatus from './ActiveImportStatus';

interface Props {
    currentImport: Importer | ImportHistory;
}

const ImportListRow = ({ currentImport }: Props) => {
    const { ID, Email } = currentImport;

    const { Active } = currentImport as Importer;
    const { EndTime, TotalSize, State: ReportStatus } = currentImport as ImportHistory;

    const isImportActive = !!Active;
    const { State, ErrorCode, CreateTime = Date.now(), Mapping = [] } = Active || {};

    const { total, processed } = Mapping.reduce(
        (
            acc: {
                total: number;
                processed: number;
            },
            { Total = 0, Processed = 0 }
        ) => {
            acc.total += Total;
            acc.processed += Processed;
            return acc;
        },
        { total: 0, processed: 0 }
    );

    const timeToDisplay = isImportActive ? CreateTime : EndTime;

    const cells = [
        <>
            <div key="email" className="w100 text-ellipsis">
                {Email}
            </div>
            <time key="importDate" className="no-desktop no-tablet">
                {format(timeToDisplay * 1000, 'PPp')}
            </time>
        </>,
        <div className="on-mobile-text-center">
            {!isImportActive ? (
                <PastImportStatus key="status" status={ReportStatus} />
            ) : (
                <ActiveImportStatus
                    key="status"
                    processed={processed}
                    total={total}
                    state={State}
                    errorCode={ErrorCode}
                />
            )}
        </div>,
        <time key="importDate">{format(timeToDisplay * 1000, 'PPp')}</time>,
        !isImportActive ? humanSize(TotalSize) : '—',
        !isImportActive ? (
            <PastImportDeleteButton key="button" ID={ID} />
        ) : (
            <ActiveImportRowActions key="actions" currentImport={currentImport} />
        ),
    ];

    return <TableRow cells={cells} />;
};

export default ImportListRow;
