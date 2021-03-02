import React, { useState, useEffect } from 'react';
import { c } from 'ttag';
import { format } from 'date-fns';

import { queryContactExport } from 'proton-shared/lib/api/contacts';
import downloadFile from 'proton-shared/lib/helpers/downloadFile';
import { wait } from 'proton-shared/lib/helpers/promise';
import { noop } from 'proton-shared/lib/helpers/function';
import { splitKeys } from 'proton-shared/lib/keys/keys';
import { prepareContact } from 'proton-shared/lib/contacts/decrypt';
import { toICAL } from 'proton-shared/lib/contacts/vcard';
import { DecryptedKey } from 'proton-shared/lib/interfaces';
import { Contact } from 'proton-shared/lib/interfaces/contacts';
import { QUERY_EXPORT_MAX_PAGESIZE, API_SAFE_INTERVAL } from 'proton-shared/lib/contacts/constants';

import { FormModal, ResetButton, PrimaryButton, Alert, DynamicProgress } from '../../../components';
import { useContacts, useApi } from '../../../hooks';

const DOWNLOAD_FILENAME = 'protonContacts';

interface FooterProps {
    loading: boolean;
}

const ExportFooter = ({ loading }: FooterProps) => {
    return (
        <>
            <ResetButton>{c('Action').t`Cancel`}</ResetButton>
            <PrimaryButton loading={loading} type="submit">
                {c('Action').t`Save`}
            </PrimaryButton>
        </>
    );
};

interface Props {
    contactGroupID?: string;
    userKeysList: DecryptedKey[];
    onSave?: () => void;
    onClose?: () => void;
}

const ExportModal = ({ contactGroupID: LabelID, userKeysList, onSave = noop, ...rest }: Props) => {
    const api = useApi();
    const [contacts = [], loadingContacts] = useContacts() as [Contact[], boolean, Error];

    const [contactsExported, addSuccess] = useState<string[]>([]);
    const [contactsNotExported, addError] = useState<string[]>([]);

    const countContacts = LabelID
        ? contacts.filter(({ LabelIDs = [] }) => LabelIDs.includes(LabelID)).length
        : contacts.length;
    const apiCalls = Math.ceil(countContacts / QUERY_EXPORT_MAX_PAGESIZE);

    const handleSave = (vcards: string[]) => {
        const allVcards = vcards.join('\n');
        const blob = new Blob([allVcards], { type: 'data:text/plain;charset=utf-8;' });
        downloadFile(blob, `${DOWNLOAD_FILENAME}-${format(Date.now(), 'yyyy-MM-dd')}.vcf`);
        onSave();
        rest.onClose?.();
    };

    useEffect(() => {
        if (loadingContacts) {
            return;
        }

        const abortController = new AbortController();
        const apiWithAbort = (config: any) => api({ ...config, signal: abortController.signal });

        const { publicKeys, privateKeys } = splitKeys(userKeysList);

        const exportBatch = async (i: number, { signal }: AbortController) => {
            const { Contacts: contacts } = (await apiWithAbort(
                queryContactExport({ LabelID, Page: i, PageSize: QUERY_EXPORT_MAX_PAGESIZE })
            )) as { Contacts: Contact[] };
            for (const { Cards, ID } of contacts) {
                if (signal.aborted) {
                    return;
                }
                try {
                    const { properties: contactDecrypted = [], errors = [] } = await prepareContact(
                        { Cards } as Contact,
                        { publicKeys, privateKeys }
                    );

                    if (errors.length) {
                        throw new Error('Error decrypting contact');
                    }

                    const contactExported = toICAL(contactDecrypted).toString();
                    // need to check again for signal.aborted because the abort
                    // may have taken place during await prepareContact
                    if (!signal.aborted) {
                        addSuccess((contactsExported) => [...contactsExported, contactExported]);
                    }
                } catch (error) {
                    // need to check again for signal.aborted because the abort
                    // may have taken place during await prepareContact
                    if (!signal.aborted) {
                        addError((contactsNotExported) => [...contactsNotExported, ID]);
                    }
                }
            }
        };

        const exportContacts = async (abortController: AbortController) => {
            for (let i = 0; i < apiCalls; i++) {
                // avoid overloading API in the unlikely case exportBatch is too fast
                await Promise.all([exportBatch(i, abortController), wait(API_SAFE_INTERVAL)]);
            }
        };

        exportContacts(abortController).catch((error) => {
            if (error.name !== 'AbortError') {
                rest.onClose?.(); // close the modal; otherwise it is left hanging in there
                throw error;
            }
        });

        return () => {
            abortController.abort();
        };
    }, [loadingContacts]);

    const success = contactsNotExported.length !== countContacts;
    const loading = loadingContacts || contactsExported.length + contactsNotExported.length !== countContacts;
    const display =
        loading || success
            ? c('Progress bar description')
                  .t`${contactsExported.length} out of ${countContacts} contacts successfully exported.`
            : c('Progress bar description').t`No contacts exported.`;

    return (
        <FormModal
            title={c('Title').t`Exporting contacts`}
            onSubmit={() => handleSave(contactsExported)}
            footer={ExportFooter({ loading })}
            loading={loadingContacts}
            {...rest}
        >
            <Alert>
                {c('Description')
                    .t`Decrypting contacts... This may take a few minutes. When the process is completed, you will be able to download the file with all your contacts exported.`}
            </Alert>
            <DynamicProgress
                id="progress-export-contacts"
                loading={loading}
                value={contactsExported.length + contactsNotExported.length}
                max={countContacts}
                success={success}
                display={loadingContacts ? '' : display}
            />
        </FormModal>
    );
};

export default ExportModal;
