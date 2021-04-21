import React, { useState, useMemo } from 'react';
import { c } from 'ttag';
import { Calendar, ACCESS_LEVEL, CalendarUrlResponse, CopyLinkParams } from 'proton-shared/lib/interfaces/calendar';

import {
    generateEncryptedPassphrase,
    generateCacheKeySalt,
    generateCacheKey,
    getCacheKeyHash,
    generateEncryptedCacheKey,
    buildLink,
    generateEncryptedPurpose,
    getPassphraseKey,
    decryptCacheKey,
} from 'proton-shared/lib/calendar/shareUrl/helpers';
import { createPublicLink, CreatePublicLinks, deletePublicLink, editPublicLink } from 'proton-shared/lib/api/calendars';
import { generateSessionKey } from 'pmcrypto';
import { splitKeys } from 'proton-shared/lib/keys';
import { AES256 } from 'proton-shared/lib/constants';
import { Nullable, SimpleMap } from 'proton-shared/lib/interfaces/utils';
import { useApi, useGetCalendarInfo, useLoading, useModals, useNotifications } from '../../../hooks';
import { useCalendarModelEventManager } from '../../eventManager';

import LinkTable from './LinkTable';
import ShareTable from './ShareTable';
import ShareLinkSuccessModal from './ShareLinkSuccessModal';
import DeleteLinkConfirmationModal from './DeleteLinkConfirmationModal';
import EditLinkModal from './EditLinkModal';
import { Alert, Loader } from '../../../components';
import useCalendarShareUrls from './useCalendarShareUrls';

interface Props {
    defaultCalendar?: Calendar;
    calendars: Calendar[];
}

const ShareSection = ({ calendars, defaultCalendar }: Props) => {
    const { links, isLoadingLinks } = useCalendarShareUrls(calendars);
    const [isLoadingCreate, withLoadingCreate] = useLoading(false);
    const [isLoadingMap, setIsLoadingMap] = useState<SimpleMap<boolean>>({});
    const api = useApi();
    const { createNotification } = useNotifications();
    const getCalendarInfo = useGetCalendarInfo();
    const { createModal } = useModals();
    const { call } = useCalendarModelEventManager();
    const defaultSelectedCalendar = useMemo(() => defaultCalendar || calendars[0], [defaultCalendar, calendars]);
    const linksPerCalendar = useMemo(
        () =>
            links?.reduce<SimpleMap<number>>((acc, link) => {
                acc[link.CalendarID] = (acc[link.CalendarID] || 0) + 1;

                return acc;
            }, {}) || {},
        [links]
    );

    const notifyLinkCopied = () => {
        createNotification({ type: 'info', text: c('Info').t`Link copied to clipboard` });
    };

    const handleCreateLink = async ({ accessLevel, calendarID }: { accessLevel: ACCESS_LEVEL; calendarID: string }) => {
        const { decryptedCalendarKeys, decryptedPassphrase, passphraseID } = await getCalendarInfo(calendarID);
        const { publicKeys } = splitKeys(decryptedCalendarKeys);

        // TODO: no user input for purpose on creating
        // const EncryptedPurpose = await generateEncryptedPurpose({ purpose, publicKeys });
        const encryptedPurpose = null;

        const passphraseKey = await generateSessionKey(AES256);
        const encryptedPassphrase =
            accessLevel === ACCESS_LEVEL.FULL
                ? generateEncryptedPassphrase({ passphraseKey, decryptedPassphrase })
                : null;

        const cacheKeySalt = generateCacheKeySalt();
        const cacheKey = generateCacheKey();
        const cacheKeyHash = await getCacheKeyHash({ cacheKey, cacheKeySalt });
        const encryptedCacheKey = await generateEncryptedCacheKey({ cacheKey, publicKeys });

        const params: CreatePublicLinks = {
            AccessLevel: accessLevel,
            CacheKeySalt: cacheKeySalt,
            CacheKeyHash: cacheKeyHash,
            EncryptedPassphrase: encryptedPassphrase,
            EncryptedPurpose: encryptedPurpose,
            EncryptedCacheKey: encryptedCacheKey,
            PassphraseID: accessLevel === ACCESS_LEVEL.FULL ? passphraseID : null,
        };

        const response = await withLoadingCreate(api<CalendarUrlResponse>(createPublicLink(calendarID, params)));

        if (!response) {
            // should never fall here as an error should have been thrown before
            throw new Error('Public link failed to be created');
        }

        const link = buildLink({
            urlID: response.CalendarUrl.CalendarUrlID,
            accessLevel,
            passphraseKey,
            cacheKey,
        });

        await call([calendarID]);
        createNotification({ type: 'success', text: c('Info').t`Link created` });

        return createModal(
            <ShareLinkSuccessModal
                onSubmit={async () => {
                    await navigator.clipboard.writeText(link);
                    notifyLinkCopied();
                }}
                accessLevel={accessLevel}
                link={link}
            />
        );
    };

    const toggleLinkLoading = (urlID: string, value: boolean) => {
        setIsLoadingMap((prevIsLoadingMap) => ({ ...prevIsLoadingMap, [urlID]: value }));
    };

    const tryLoadingAction = async (urlID: string, fn: Function) => {
        try {
            toggleLinkLoading(urlID, true);
            await fn();
        } catch (error) {
            createNotification({ type: 'error', text: error.message });
        } finally {
            toggleLinkLoading(urlID, false);
        }
    };

    const handleCopyLink = ({
        calendarID,
        urlID,
        accessLevel,
        encryptedPassphrase,
        encryptedCacheKey,
    }: CopyLinkParams) => {
        return tryLoadingAction(urlID, async () => {
            const { decryptedPassphrase: calendarPassphrase, decryptedCalendarKeys } = await getCalendarInfo(
                calendarID
            );
            const { privateKeys } = splitKeys(decryptedCalendarKeys);
            const cacheKey = await decryptCacheKey({ encryptedCacheKey, privateKeys });
            const passphraseKey = getPassphraseKey({ encryptedPassphrase, calendarPassphrase });
            const link = buildLink({
                urlID,
                accessLevel,
                passphraseKey,
                cacheKey,
            });

            await navigator.clipboard.writeText(link);
            notifyLinkCopied();
        });
    };

    const handleEdit = ({
        calendarID,
        urlID,
        purpose,
    }: {
        calendarID: string;
        urlID: string;
        purpose: Nullable<string>;
    }) => {
        return new Promise<void>((resolve, reject) => {
            createModal(
                <EditLinkModal
                    onSubmit={async (untrimmedPurpose) => {
                        return tryLoadingAction(urlID, async () => {
                            const { decryptedCalendarKeys } = await getCalendarInfo(calendarID);
                            const { publicKeys } = splitKeys(decryptedCalendarKeys);
                            const purpose = untrimmedPurpose.trim();
                            const encryptedPurpose = purpose
                                ? await generateEncryptedPurpose({ purpose, publicKeys })
                                : null;

                            await api<void>(editPublicLink({ calendarID, urlID, encryptedPurpose }));
                            await call([calendarID]);
                        });
                    }}
                    decryptedPurpose={purpose}
                    onClose={reject}
                />
            );
        });
    };
    const handleDelete = ({ calendarID, urlID }: { calendarID: string; urlID: string }) => {
        return new Promise((_resolve, reject) => {
            createModal(
                <DeleteLinkConfirmationModal
                    onConfirm={() => {
                        return tryLoadingAction(urlID, async () => {
                            await api<void>(deletePublicLink({ calendarID, urlID }));
                            await call([calendarID]);
                            createNotification({ type: 'success', text: c('Info').t`Link deleted` });
                        });
                    }}
                    onClose={reject}
                />
            );
        });
    };

    const infoAlert = (
        <Alert type="info">{c('Info')
            .t`Create a link to your calendar and share it with anyone outside Proton. Only you can add or remove events.`}</Alert>
    );

    return (
        <>
            {defaultSelectedCalendar ? (
                <>
                    {infoAlert}
                    <ShareTable
                        linksPerCalendar={linksPerCalendar}
                        isLoading={isLoadingCreate}
                        disabled={!!isLoadingLinks}
                        calendars={calendars}
                        onCreateLink={handleCreateLink}
                        defaultSelectedCalendar={defaultSelectedCalendar}
                    />
                </>
            ) : (
                <>
                    <Alert type="warning">{c('Info').t`You need to have a calendar to create a link.`}</Alert>
                    {infoAlert}
                </>
            )}
            {isLoadingLinks ? (
                <div className="text-center">
                    <Loader />
                </div>
            ) : (
                <LinkTable
                    isLoadingMap={isLoadingMap}
                    links={links}
                    onCopyLink={handleCopyLink}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
};

export default ShareSection;
