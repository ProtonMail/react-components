import React, { useEffect, useMemo, useState } from 'react';
import { c } from 'ttag';
import { Calendar, ACCESS_LEVEL } from 'proton-shared/lib/interfaces/calendar';
import { SimpleMap } from 'proton-shared/lib/interfaces/utils';

import {
    Icon,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    Button,
    Info,
    SelectTwo,
    Option,
    Alert,
} from '../../../components';

interface Props {
    calendars: Calendar[];
    onCreateLink: ({ accessLevel, calendarID }: { accessLevel: ACCESS_LEVEL; calendarID: string }) => Promise<void>;
    isLoading: boolean;
    disabled: boolean;
    defaultSelectedCalendar: Calendar;
    linksPerCalendar: SimpleMap<number>;
}

const ShareTable = ({
    defaultSelectedCalendar,
    calendars = [],
    onCreateLink,
    isLoading,
    disabled,
    linksPerCalendar,
}: Props) => {
    const [selectedCalendarID, setSelectedCalendarID] = useState(defaultSelectedCalendar.ID);
    const [accessLevel, setAccessLevel] = useState<ACCESS_LEVEL>(ACCESS_LEVEL.LIMITED);
    const maxLinksPerCalendarReached = useMemo(() => linksPerCalendar?.[selectedCalendarID] === 5, [
        linksPerCalendar,
        selectedCalendarID,
    ]);
    const shouldDisableCreateButton = disabled || maxLinksPerCalendarReached;

    useEffect(() => {
        setSelectedCalendarID(defaultSelectedCalendar.ID);
    }, [calendars, defaultSelectedCalendar]);

    return (
        <>
            <Table>
                <TableHeader
                    cells={[
                        c('Header').t`Calendar`,
                        <>
                            {c('Header').t`What others see`}{' '}
                            <Info
                                title={c('Info')
                                    .t`Limited view: others see if you're busy. Full view: shows all event details, including name, location, or participants.`}
                            />
                        </>,
                        null,
                    ]}
                />
                <TableBody>
                    <TableRow
                        cells={[
                            <div key="id" className="flex flex-nowrap flex-align-items-center">
                                {calendars.length === 1 ? (
                                    <div className="flex flex-align-items-center">
                                        <Icon
                                            name="calendar"
                                            className="mr0-75"
                                            style={{ color: calendars[0].Color }}
                                        />
                                        <span className="text-ellipsis">{calendars[0].Name}</span>
                                    </div>
                                ) : (
                                    <SelectTwo
                                        disabled={disabled}
                                        value={selectedCalendarID}
                                        onChange={({ value }) => setSelectedCalendarID(value)}
                                    >
                                        {calendars.map(({ ID, Name, Color }) => (
                                            <Option key={ID} value={ID} title={Name}>
                                                <div className="flex flex-nowrap flex-align-items-center">
                                                    <Icon
                                                        name="calendar"
                                                        className="mr0-75 flex-item-noshrink"
                                                        style={{ color: Color }}
                                                    />
                                                    <span className="text-ellipsis">{Name}</span>
                                                </div>
                                            </Option>
                                        ))}
                                    </SelectTwo>
                                )}
                            </div>,
                            <div key="what-others-see">
                                <SelectTwo
                                    disabled={disabled}
                                    value={accessLevel}
                                    onChange={({ value }) => setAccessLevel(value)}
                                >
                                    <Option value={0} title={c('Access level').t`Limited view (no event details)`} />
                                    <Option value={1} title={c('Access level').t`Full view`} />
                                </SelectTwo>
                            </div>,
                            <Button
                                color="norm"
                                loading={isLoading}
                                disabled={shouldDisableCreateButton}
                                onClick={() => onCreateLink({ accessLevel, calendarID: selectedCalendarID })}
                            >
                                <Icon name="link" className="mr0-75" />
                                {c('Action').t`Create link`}
                            </Button>,
                        ]}
                    />
                </TableBody>
            </Table>
            {maxLinksPerCalendarReached && (
                <Alert className="mb1-5" type="warning">{c('Info')
                    .t`You can create up to 5 links per calendar. To create a new link to this calendar, delete one from the list below.`}</Alert>
            )}
        </>
    );
};

export default ShareTable;
