import React from 'react';
import { c } from 'ttag';
import { Nullable, SimpleMap } from 'proton-shared/lib/interfaces/utils';
import { ACCESS_LEVEL, CalendarLink, CopyLinkParams } from 'proton-shared/lib/interfaces/calendar';

import { Table, TableHeader, TableBody, TableRow, Info, DropdownActions, Icon } from '../../../components';

interface Props {
    links?: CalendarLink[];
    onEdit: ({ calendarID, urlID, purpose }: { calendarID: string; urlID: string; purpose: Nullable<string> }) => void;
    onCopyLink: (params: CopyLinkParams) => void;
    onDelete: ({ calendarID, urlID }: { calendarID: string; urlID: string }) => void;
    isLoadingMap: SimpleMap<boolean>;
}

const sortLinks = (links: CalendarLink[]) => [...links].sort((a, b) => a.CreateTime - b.CreateTime);

const LinkTable = ({ links, onCopyLink, onDelete, onEdit, isLoadingMap }: Props) => {
    if (!links?.length) {
        return null;
    }

    return (
        <>
            <Table className="simple-table--has-actions">
                <TableHeader
                    cells={[
                        c('Header').t`Calendar`,
                        <>
                            {c('Header').t`Label`} <Info title={c('Info').t`Only you can see the labels.`} />
                        </>,
                        c('Header').t`Actions`,
                    ]}
                />
                <TableBody>
                    {sortLinks(links).map(
                        ({
                            CalendarID,
                            CalendarUrlID,
                            AccessLevel: accessLevel,
                            EncryptedPassphrase,
                            EncryptedCacheKey,
                            color,
                            calendarName,
                            purpose,
                        }) => {
                            const list = [
                                {
                                    text: c('Action').t`Copy link`,
                                    onClick: () =>
                                        onCopyLink({
                                            calendarID: CalendarID,
                                            urlID: CalendarUrlID,
                                            accessLevel,
                                            encryptedPassphrase: EncryptedPassphrase,
                                            encryptedCacheKey: EncryptedCacheKey,
                                        }),
                                },
                                {
                                    text: c('Action').t`Edit label`,
                                    onClick: () => onEdit({ calendarID: CalendarID, urlID: CalendarUrlID, purpose }),
                                },
                                {
                                    text: <span className="color-global-warning">{c('Action').t`Delete`}</span>,
                                    actionType: 'delete',
                                    onClick: () => onDelete({ calendarID: CalendarID, urlID: CalendarUrlID }),
                                } as const,
                            ];

                            return (
                                <TableRow
                                    key={CalendarUrlID}
                                    cells={[
                                        <div key="calendar">
                                            <div className="flex">
                                                <Icon name="calendar" style={{ color }} className="mr0-75" />
                                                <div className="text-ellipsis">
                                                    {calendarName}
                                                    <div className="text-sm m0">
                                                        {accessLevel === ACCESS_LEVEL.FULL
                                                            ? c('Access level').t`Full`
                                                            : c('Access level').t`Limited`}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>,
                                        <div key="label" className="text-ellipsis">
                                            {purpose}
                                        </div>,
                                        <DropdownActions
                                            loading={isLoadingMap[CalendarUrlID]}
                                            className="button--small"
                                            key="actions"
                                            list={list}
                                        />,
                                    ]}
                                />
                            );
                        }
                    )}
                </TableBody>
            </Table>
        </>
    );
};

export default LinkTable;
