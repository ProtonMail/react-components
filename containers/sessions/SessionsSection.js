import React, { useState, useEffect } from 'react';
import { c } from 'ttag';
import {
    Button,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    Time,
    Pagination,
    Alert,
    Block,
    SubTitle,
    ConfirmModal,
    useApi,
    useAuthentication,
    useModals,
    useLoading,
    usePagination,
    useNotifications
} from 'react-components';
import { querySessions, revokeOtherSessions, revokeSession } from 'proton-shared/lib/api/auth';
import { ELEMENTS_PER_PAGE } from 'proton-shared/lib/constants';

import SessionAction from './SessionAction';

/*
    Here is the list of UIDs returned by the API, for reference:

    // Old FE apps
    'Web' => '>=3.16.4',
    'VPN' => '>=2.0.0',
    'WebVPN' => '>=4.0.0',
    'Admin' => '>=0.5.1',

    // Old Desktop
    'ImportExport' => '>=0.1.6',
    'Bridge' => '>=1.2.0',

    // Old iOS
    'iOS' => '>=1.11.11',

    // Old Android
    'Android' => '>=1.12.0',

    // Web
    'WebMail' => '>=0.0.0',
    'WebMailSettings' => '>=0.0.0',
    'WebContacts' => '>=0.0.0',
    'WebVPNSettings' => '>=4.0.0',
    'WebCalendar' => '>=0.0.0',
    'WebDrive' => '>=0.0.0',
    'WebWallet' => '>=0.0.0',
    'WebAdmin' => '>=0.5.1',

    // iOS
    'iOSMail' => '>=1.11.11',
    'iOSVPN' => '>=0.0.0',
    'iOSCalendar' => '>=0.0.0',

    // Android
    'AndroidMail' => '>=1.12.0',
    'AndroidVPN' => '>=1.3.7',
    'AndroidCalendar' => '>=0.0.0',

    // Windows
    'WindowsVPN' => '>=0.0.0',
    'WindowsImportExport' => '>=0.1.6',
    'WindowsBridge' => '>=1.2.0',

    // MacOS
    'macOSVPN' => '>=0.0.0',
    'macOSImportExport' => '>=0.1.6',
    'macOSBridge' => '>=1.2.0',

    // Linux
    'LinuxImportExport' => '>=0.1.6',
    'LinuxBridge' => '>=1.2.0',
*/

const getClientsI18N = () => ({
    Web: c('Badge').t`ProtonMail for web`,
    VPN: c('Badge').t`ProtonVPN for Windows`,
    WebVPN: c('Badge').t`ProtonVPN for web`,
    Admin: c('Badge').t`Admin`,
    ImportExport: c('Badge').t`ProtonMail import-export`,
    Bridge: c('Badge').t`ProtonMail Bridge`,
    iOS: c('Badge').t`ProtonMail for iOS`,
    Android: c('Badge').t`ProtonMail for Android`,
    WebMail: c('Badge').t`ProtonMail for web`,
    WebMailSettings: c('Badge').t`ProtonMail settings for web`,
    WebContacts: c('Badge').t`ProtonContacts for web`,
    WebVPNSettings: c('Badge').t`ProtonVPN settings for web`,
    WebCalendar: c('Badge').t`ProtonCalendar for web`,
    WebDrive: c('Badge').t`ProtonDrive for web`,
    WebWallet: c('Badge').t`ProtonWallet for web`,
    WebAdmin: c('Badge').t`Admin`,
    iOSMail: c('Badge').t`ProtonMail for iOS`,
    iOSVPN: c('Badge').t`ProtonVPN for iOS`,
    iOSCalendar: c('Badge').t`ProtonCalendar for iOS`,
    AndroidMail: c('Badge').t`ProtonMail for Android`,
    AndroidVPN: c('Badge').t`ProtonVPN for Android`,
    AndroidCalendar: c('Badge').t`ProtonCalendar for Android`,
    WindowsVPN: c('Badge').t`ProtonVPN for Windows`,
    WindowsImportExport: c('Badge').t`ProtonMail import-export for Windows`,
    WindowsBridge: c('Badge').t`ProtonMail Bridge for Windows`,
    macOSVPN: c('Badge').t`ProtonVPN for macOS`,
    macOSImportExport: c('Badge').t`ProtonMail import-export for macOS`,
    macOSBridge: c('Badge').t`ProtonMail Bridge for macOS`,
    LinuxImportExport: c('Badge').t`ProtonMail import-export for Linux`,
    LinuxBridge: c('Badge').t`ProtonMail Bridge for Linux`
});

const SessionsSection = () => {
    const { createNotification } = useNotifications();
    const api = useApi();
    const authentication = useAuthentication();
    const [loading, withLoading] = useLoading();
    const [table, setTable] = useState({ sessions: [], total: 0 });
    const { page, list, onNext, onPrevious, onSelect } = usePagination(table.sessions);
    const { createModal } = useModals();

    const fetchSessions = async () => {
        const { Sessions } = await api(querySessions());
        setTable({ sessions: Sessions.reverse(), total: Sessions.length }); // Most recent, first
    };

    const handleRevoke = async (UID) => {
        await api(UID ? revokeSession(UID) : revokeOtherSessions());
        await fetchSessions();
        createNotification({ text: UID ? c('Success').t`Session revoked` : c('Success').t`Sessions revoked` });
    };

    const handleOpenModal = () => {
        createModal(
            <ConfirmModal onConfirm={() => withLoading(handleRevoke())}>
                <Alert>{c('Info').t`Do you want to revoke all other sessions than the current one?`}</Alert>
            </ConfirmModal>
        );
    };

    useEffect(() => {
        withLoading(fetchSessions());
    }, []);

    const i18n = getClientsI18N();
    const currentUID = authentication.getUID();

    return (
        <>
            <SubTitle>{c('Title').t`Sessions`}</SubTitle>
            <Alert learnMore="https://protonmail.com/support/knowledge-base/log-out-all-other-sessions/">{c('Info')
                .t`Unless you explicitly logout or change your password, sessions can last for up to 6 months. Sessions expire after 2 weeks of inactivity.`}</Alert>
            <Block className="flex flex-spacebetween">
                <div>
                    <Button onClick={handleOpenModal}>{c('Action').t`Revoke all other sessions`}</Button>
                </div>
                <Pagination
                    page={page}
                    total={table.total}
                    limit={ELEMENTS_PER_PAGE}
                    onNext={onNext}
                    onPrevious={onPrevious}
                    onSelect={onSelect}
                />
            </Block>
            <Table>
                <TableHeader cells={[c('Title').t`App`, c('Title').t`Date`, c('Title').t`Action`]} />
                <TableBody loading={loading} colSpan={3}>
                    {list.map((session) => {
                        const key = session.UID;
                        return (
                            <TableRow
                                key={key}
                                cells={[
                                    i18n[session.ClientID],
                                    <Time format="PPp" key={1}>
                                        {session.CreateTime}
                                    </Time>,
                                    <SessionAction
                                        key={2}
                                        session={session}
                                        currentUID={currentUID}
                                        onRevoke={() => withLoading(handleRevoke(session.UID))}
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

export default SessionsSection;
