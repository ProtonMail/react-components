import React, { useState, useEffect, useMemo } from 'react';
import { c } from 'ttag';
import {
    Calendar,
    ACCESS_LEVEL,
    CalendarMap,
    CalendarURL,
    CalendarLink,
    CalendarUrlResponse,
    CalendarUrlsResponse,
    CopyLinkParams,
} from 'proton-shared/lib/interfaces/calendar';

import {
    generateEncryptedPassphrase,
    generateCacheKeySalt,
    generateCacheKey,
    getCacheKeyHash,
    generateEncryptedCacheKey,
    decryptPurpose,
    buildLink,
    generateEncryptedPurpose,
    getPassphraseKey,
    decryptCacheKey,
} from 'proton-shared/lib/keys/calendarSharing';
import {
    createPublicLink,
    CreatePublicLinks,
    deletePublicLink,
    editPublicLink,
    getPublicLinks,
} from 'proton-shared/lib/api/calendars';
import { generateSessionKey } from 'pmcrypto';
import { splitKeys } from 'proton-shared/lib/keys';
import { AES256 } from 'proton-shared/lib/constants';
import { replace } from 'proton-shared/lib/helpers/array';
import { Nullable, SimpleMap } from 'proton-shared/lib/interfaces/utils';
import { useApi, useGetCalendarInfo, useModals, useNotifications } from '../../../hooks';

import LinkTable from './LinkTable';
import ShareTable from './ShareTable';
import ShareLinkSuccessModal from './ShareLinkSuccessModal';
import DeleteLinkConfirmationModal from './DeleteLinkConfirmationModal';
import EditLinkModal from './EditLinkModal';
import { Alert, Loader } from '../../../components';

interface Props {
    defaultCalendar?: Calendar;
    calendars: Calendar[];
}

const ShareSection = ({ calendars, defaultCalendar }: Props) => {
    const [isLoadingLinkList, setIsLoadingLinkList] = useState<boolean>(false);
    const [isLoadingCreate, setIsLoadingCreate] = useState<boolean>(false);
    const [isLoadingMap, setIsLoadingMap] = useState<SimpleMap<boolean>>({});
    const [links, setLinks] = useState<CalendarLink[]>();
    const api = useApi();
    const { createNotification } = useNotifications();
    const getCalendarInfo = useGetCalendarInfo();
    const { createModal } = useModals();
    // const { call } = useEventManager();
    const calendarsMap = useMemo(
        () =>
            calendars.reduce<CalendarMap>((acc, curr) => {
                acc[curr.ID] = {
                    ...curr,
                };

                return acc;
            }, {}),
        [calendars]
    );
    const defaultSelectedCalendar = useMemo(() => defaultCalendar || calendars[0], [defaultCalendar, calendars]);
    const linksPerCalendar = useMemo(
        () =>
            links?.reduce<SimpleMap<number>>((acc, link) => {
                acc[link.CalendarID] = (acc[link.CalendarID] || 0) + 1;

                return acc;
            }, {}) || {},
        [links]
    );

    const transformAndSetLinksFromAPI = async (linksFromAPI: CalendarURL[]) => {
        setLinks(
            (
                await Promise.all(
                    linksFromAPI.map(async (link) => {
                        let purpose = null;

                        if (link.EncryptedPurpose) {
                            try {
                                const { decryptedCalendarKeys } = await getCalendarInfo(link.CalendarID);
                                const { privateKeys } = splitKeys(decryptedCalendarKeys);

                                purpose = await decryptPurpose({
                                    encryptedPurpose: link.EncryptedPurpose,
                                    privateKeys,
                                });
                            } catch (error) {
                                createNotification({ type: 'error', text: error.message });
                                purpose = link.EncryptedPurpose;
                            }
                        }

                        return {
                            ...link,
                            calendarName: calendarsMap[link.CalendarID].Name,
                            color: calendarsMap[link.CalendarID].Color,
                            purpose,
                        };
                    })
                )
            ).flat()
        );
    };

    const getAllLinks = async () => {
        try {
            setIsLoadingLinkList(true);
            const responses = await Promise.all(
                calendars.map(({ ID }) => api<CalendarUrlsResponse>(getPublicLinks(ID)))
            );
            const calendarURLS = responses?.flatMap(({ CalendarUrls }) => CalendarUrls);

            if (calendarURLS) {
                await transformAndSetLinksFromAPI(calendarURLS);
            }
        } catch (error) {
            createNotification({ type: 'error', text: error.message });
        } finally {
            setIsLoadingLinkList(false);
        }
    };

    useEffect(() => {
        void getAllLinks();
    }, [calendars]);

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

        setIsLoadingCreate(true);

        const {
            CalendarUrl: { CalendarUrlID },
        } = await api<CalendarUrlResponse>(createPublicLink(calendarID, params)).finally(() =>
            setIsLoadingCreate(false)
        );

        const link = buildLink({
            urlID: CalendarUrlID,
            accessLevel,
            passphraseKey,
            cacheKey,
        });

        const newLink = {
            ...params,
            CalendarID: calendarID,
            CalendarUrlID,
            calendarName: calendarsMap[calendarID].Name,
            color: calendarsMap[calendarID].Color,
            purpose: null,
            CreateTime: Math.floor(new Date().getTime() / 1000),
        };

        setLinks([...(links || []), newLink]);
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

                            const link = links?.find(({ CalendarUrlID }) => urlID === CalendarUrlID);

                            if (links && link) {
                                setLinks(replace(links, link, { ...link, purpose }));
                                createNotification({ type: 'success', text: c('Info').t`Label updated` });
                            }
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

                            setLinks(links?.filter(({ CalendarUrlID }) => CalendarUrlID !== urlID));
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
                        disabled={isLoadingLinkList}
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
            {isLoadingLinkList ? (
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
