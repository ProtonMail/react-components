import React from 'react';
import { c } from 'ttag';

import { Row, Label, Field, Info, PrimaryButton } from '../../../components';
import { useMailSettings, useModals, useUserKeys } from '../../../hooks';
import AutoSaveContactsToggle from '../../general/AutoSaveContactsToggle';
import ExportContactsModal from '../modals/ExportContactsModal';
import ImportContactsModal from '../import/ImportContactsModal';

interface Props {
    onClose: () => void;
}

const ContactsWidgetSettingsContainer = ({ onClose }: Props) => {
    const [mailSettings] = useMailSettings();
    const { AutoSaveContacts } = mailSettings || {};
    const { createModal } = useModals();
    const [userKeysList, loadingUserKeys] = useUserKeys();

    const handleImport = () => {
        createModal(<ImportContactsModal />);
    };

    const handleExport = () => {
        createModal(<ExportContactsModal userKeysList={userKeysList} />);
        onClose();
    };

    return (
        <div className="pl2 pr2 pt1 pb1">
            <Row>
                <Label htmlFor="saveContactToggle">
                    <span className="mr0-5 text-semibold">{c('Label').t`Automatically save contacts`}</span>
                    <Info url="https://protonmail.com/support/knowledge-base/autosave-contact-list/" />
                </Label>
                <Field className="pt0-5">
                    <AutoSaveContactsToggle autoSaveContacts={!!AutoSaveContacts} id="saveContactToggle" />
                </Field>
            </Row>
            <div className="mb2">
                <Label htmlFor="import-contacts-button" className="text-semibold">{c('Label')
                    .t`Import contacts`}</Label>
                <p className="color-weak mt0-5 mb1">{c('Info')
                    .t`We support importing CSV files from Outlook, Outlook Express, Yahoo! Mail, Hotmail, Eudora and some other apps. We also support importing vCard 4.0. (UTF-8 encoding).`}</p>
                <PrimaryButton id="import-contacts-button" onClick={handleImport}>{c('Action')
                    .t`Import contacts`}</PrimaryButton>
            </div>
            <div>
                <Label htmlFor="export-contacts-button" className="text-semibold">{c('Label')
                    .t`Export contacts`}</Label>
                <p className="color-weak mt0-5 mb1">{c('Info')
                    .t`The application needs to locally decrypt your contacts before they can be exported. At the end of the process, a VCF file will be generated and you will be able to download it.`}</p>
                <PrimaryButton disabled={loadingUserKeys} id="export-contacts-button" onClick={handleExport}>{c(
                    'Action'
                ).t`Export contacts`}</PrimaryButton>
            </div>
        </div>
    );
};

export default ContactsWidgetSettingsContainer;
