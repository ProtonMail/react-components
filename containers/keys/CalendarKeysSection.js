import React, { useState, useEffect } from 'react';
import { c } from 'ttag';
import {
    Block,
    Select,
    SubTitle,
    PrimaryButton,
    Alert,
    useModals,
    useUserKeys,
    useUser,
    useCalendars,
    useCalendarKeys,
    Loader
} from 'react-components';
import { KEY_FLAG } from 'proton-shared/lib/constants';

import { getAllKeysToReactivate, convertCalendarKey } from './shared/helper';
import { ACTIONS } from './KeysActions';
import KeysTable from './KeysTable';
import ReactivateCalendarKeysModal from './reactivateKeys/ReactivateCalendarKeysModal';

const { SIGNED, ENCRYPTED_AND_SIGNED, CLEAR_TEXT } = KEY_FLAG;

/**
 * @param {number} action
 * @return {number}
 */
export const getNewKeyFlags = (action) => {
    if (action === ACTIONS.MARK_OBSOLETE) {
        return SIGNED;
    }
    if (action === ACTIONS.MARK_NOT_OBSOLETE) {
        return ENCRYPTED_AND_SIGNED;
    }
    if (action === ACTIONS.MARK_COMPROMISED) {
        return CLEAR_TEXT;
    }
    if (action === ACTIONS.MARK_NOT_COMPROMISED) {
        return SIGNED;
    }
    throw new Error('Unknown action');
};

const CalendarKeysSection = () => {
    const { createModal } = useModals();
    const [User] = useUser();
    const [calendars, loadingCalendars] = useCalendars();
    const [userKeysList] = useUserKeys(User);
    const [calendarsKeysMap, loadingCalendarsKeys] = useCalendarKeys(User, calendars, userKeysList);
    const [loadingKeyIdx, setLoadingKeyIdx] = useState(-1);
    const [calendarIndex, setCalendarIndex] = useState(() => (Array.isArray(calendars) ? 0 : -1));
    const title = <SubTitle>{c('Title').t`Calendar encryption keys`}</SubTitle>;

    useEffect(() => {
        if (calendarIndex === -1 && Array.isArray(calendars)) {
            setCalendarIndex(0);
        }
    }, [calendarIndex, calendars]);

    if (calendarIndex === -1 || loadingCalendars) {
        return (
            <>
                {title}
                <Loader />
            </>
        );
    }

    if (!Array.isArray(calendars) || !calendars.length) {
        return (
            <>
                {title}
                <Alert>{c('Info').t`No calendars exist`}</Alert>
            </>
        );
    }

    const calendar = calendars[calendarIndex];
    const { ID: calendarID } = calendar;
    const calendarKeys = calendarsKeysMap && calendarsKeysMap[calendarID];

    if (loadingCalendarsKeys && !Array.isArray(calendarKeys)) {
        return (
            <>
                {title}
                <Loader />
            </>
        );
    }

    const handleAction = async (action, targetKey) => {
        if (action === ACTIONS.REACTIVATE) {
            const calendarKeysToReactivate = [
                {
                    Calendar: calendar,
                    inactiveKeys: [targetKey],
                    keys: calendarKeys
                }
            ];
            return createModal(<ReactivateCalendarKeysModal allKeys={calendarKeysToReactivate} />);
        }
    };

    const isLoadingKey = loadingKeyIdx !== -1;

    const handleKeyAction = async (action, keyIdx) => {
        // Since an action affects the whole key list, only allow one at a time.
        if (isLoadingKey) {
            return;
        }
        try {
            setLoadingKeyIdx(keyIdx);
            const targetKey = calendarKeys[keyIdx];
            await handleAction(action, targetKey);
            setLoadingKeyIdx(-1);
        } catch (e) {
            setLoadingKeyIdx(-1);
        }
    };

    const calendarKeysFormatted = calendarKeys.map(({ Key, privateKey }, idx) => {
        return {
            isLoading: loadingKeyIdx === idx,
            ...convertCalendarKey({ User, calendar: calendar, Key, privateKey })
        };
    });

    const { isSubUser } = User;
    const allKeysToReactivate = getAllKeysToReactivate({ calendars, User, calendarsKeysMap, userKeysList });
    const totalInactiveKeys = allKeysToReactivate.reduce((acc, { inactiveKeys }) => acc + inactiveKeys.length, 0);
    const canReactivate = !isSubUser && totalInactiveKeys >= 1;

    return (
        <>
            {title}
            <Alert>{c('Info').t`Download your PGP keys in order to recover your Calendar data.`}</Alert>
            {canReactivate && (
                <Block>
                    <PrimaryButton
                        onClick={() => {
                            !isLoadingKey && createModal(<ReactivateCalendarKeysModal allKeys={allKeysToReactivate} />);
                        }}
                    >
                        {c('Action').t`Reactivate keys`}
                    </PrimaryButton>
                </Block>
            )}
            {calendars.length > 1 && (
                <Block>
                    <Select
                        value={calendarIndex}
                        options={calendars.map(({ Name }, i) => ({ text: Name, value: i }))}
                        onChange={({ target: { value } }) => !isLoadingKey && setCalendarIndex(+value)}
                    />
                </Block>
            )}
            <KeysTable keys={calendarKeysFormatted} onAction={handleKeyAction} />
        </>
    );
};

export default CalendarKeysSection;
