import React from 'react';
import { c } from 'ttag';
import { getIsCalendarDisabled, getIsCalendarProbablyActive } from 'proton-shared/lib/calendar/calendar';
import { CALENDAR_TYPE, CalendarWithPossibleSubscriptionParameters } from 'proton-shared/lib/interfaces/calendar';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';
import { UserModel } from 'proton-shared/lib/interfaces';

import { omit } from 'proton-shared/lib/helpers/object';
import { Badge, DropdownActions, Icon, Info, Table, TableBody, TableHeader, TableRow } from '../../../components';
import useGetCalendarEmail from '../hooks/useGetCalendarEmail';

import './CalendarsTable.scss';
import { classnames } from '../../../helpers';

interface Props {
    calendars: CalendarWithPossibleSubscriptionParameters[];
    defaultCalendarID?: string;
    user: UserModel;
    onEdit: (calendar: CalendarWithPossibleSubscriptionParameters) => void;
    onSetDefault: (id: string) => void;
    onDelete: (calendar: CalendarWithPossibleSubscriptionParameters) => void;
    onExport: (calendar: CalendarWithPossibleSubscriptionParameters) => void;
    loadingMap: { [key: string]: boolean };
}
const CalendarsTable = ({
    calendars = [],
    defaultCalendarID,
    user,
    onEdit,
    onSetDefault,
    onDelete,
    onExport,
    loadingMap,
}: Props) => {
    const calendarAddressMap = useGetCalendarEmail(calendars);

    return (
        <Table className="simple-table--has-actions">
            <TableHeader
                cells={[
                    c('Header').t`Name`,
                    <div className="flex flex-align-items-center">
                        <span className="mr0-5">{c('Header').t`Status`} </span>
                        <Info url="" /> {/* TODO: coming soon */}
                    </div>,
                    c('Header').t`Actions`,
                ]}
            />
            <TableBody>
                {(calendars || []).map((calendar, index) => {
                    const { ID, Name, Color, Type } = calendar;

                    const isDisabled = getIsCalendarDisabled(calendar);
                    const isActive = getIsCalendarProbablyActive(calendar);
                    const isDefault = ID === defaultCalendarID;
                    const isSubscribe = Type === CALENDAR_TYPE.SUBSCRIPTION;
                    const isNotSynced = isSubscribe && calendar.SubscriptionParameters?.Status !== 0;

                    const list: { text: string; onClick: () => void }[] = [
                        {
                            shouldShow: user.hasNonDelinquentScope,
                            text: c('Action').t`Edit`,
                            onClick: () => onEdit(calendar),
                        },
                        {
                            shouldShow: !isSubscribe && !isDisabled && !isDefault && user.hasNonDelinquentScope,
                            text: c('Action').t`Set as default`,
                            onClick: () => onSetDefault(ID),
                        },
                        {
                            shouldShow: !isSubscribe,
                            text: c('Action').t`Export ICS`,
                            onClick: () => onExport(calendar),
                        },
                        {
                            shouldShow: true,
                            text: isSubscribe ? c('Action').t`Unsubscribe` : c('Action').t`Delete`,
                            actionType: 'delete',
                            onClick: () => onDelete(calendar),
                        },
                    ].flatMap((item) => (isTruthy(item.shouldShow) ? omit(item, ['shouldShow']) : []));

                    return (
                        <TableRow
                            key={ID}
                            cells={[
                                <div key="id">
                                    <div className="grid-align-icon">
                                        <Icon name="calendar" color={Color} className="mr0-5 flex-item-noshrink" />
                                        <div className="text-ellipsis" title={Name}>
                                            {Name}
                                        </div>
                                        <div
                                            className={classnames([
                                                'text-ellipsis text-sm m0 color-weak',
                                                !calendarAddressMap[ID] && 'calendar-email',
                                            ])}
                                            style={{ '--index': index }}
                                        >
                                            {calendarAddressMap[ID] || ''}
                                        </div>
                                    </div>
                                </div>,
                                <div data-test-id="calendar-settings-page:calendar-status" key="status">
                                    {isDefault && <Badge type="primary">{c('Calendar status').t`Default`}</Badge>}
                                    {isActive && <Badge type="success">{c('Calendar status').t`Active`}</Badge>}
                                    {isDisabled && <Badge type="warning">{c('Calendar status').t`Disabled`}</Badge>}
                                    {isNotSynced && <Badge type="warning">{c('Calendar status').t`Not synced`}</Badge>}
                                </div>,
                                <DropdownActions
                                    className="button--small"
                                    key="actions"
                                    list={list}
                                    loading={!!loadingMap[ID]}
                                />,
                            ]}
                        />
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default CalendarsTable;
