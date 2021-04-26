import React from 'react';
import { c, msgid } from 'ttag';

import { ContactEmail } from 'proton-shared/lib/interfaces/contacts/Contact';
import { noop } from 'proton-shared/lib/helpers/function';
import { FormModal, ContactGroupTable, Icon, TitleModal, Button } from '../../../components';
import { useContactEmails, useContactGroups, useModals } from '../../../hooks';
import ContactGroupModal from './ContactGroupModal';
import './ContactGroupDetailsModal.scss';
import Tooltip from '../../../components/tooltip/Tooltip';
import ContactGroupDeleteModal from './ContactGroupDeleteModal';

interface Props {
    contactGroupID: string;
    onClose?: () => void;
    onEdit: () => void;
}

const ContactGroupDetailsModal = ({ contactGroupID, onClose = noop, onEdit, ...rest }: Props) => {
    const [contactGroups = [], loadingGroups] = useContactGroups();
    const [contactEmails = [], loadingEmails] = useContactEmails() as [ContactEmail[] | undefined, boolean, any];

    const group = contactGroups.find(({ ID }) => ID === contactGroupID);
    const emails = contactEmails.filter(({ LabelIDs = [] }: { LabelIDs: string[] }) =>
        LabelIDs.includes(contactGroupID)
    );
    const emailsCount = emails.length;

    const handleEdit = () => {
        onEdit();
        onClose();
    };

    const handleDelete = () => {
        createModal(<ContactGroupDeleteModal groupIDs={[contactGroupID]} />);
        onClose();
    };

    return (
        <FormModal
            onSubmit={handleEdit}
            loading={loadingGroups || loadingEmails}
            close={c('Action').t`Close`}
            submit={c('Action').t`Edit`}
            modalTitleID="contact-group-details-modal"
            title={
                <TitleModal id="contact-group-details-modal" className="flex flex-row flex-align-items-center">
                    <div
                        className="contact-group-details-chip rounded50 mr0-5"
                        style={{ backgroundColor: group?.Color }}
                    />
                    {group?.Name}
                </TitleModal>
            }
            onClose={onClose}
            {...rest}
        >
            <div className="flex flex-no-min-children flex-item-fluid">
                <h4 className="mb1 flex flex-align-items-center flex-item-fluid">
                    <Icon className="mr0-5" name="contacts-groups" />
                    <span>
                        {c('Title').ngettext(msgid`${emailsCount} member`, `${emailsCount} members`, emailsCount)}
                    </span>
                </h4>
                <div className="flex-item-noshrink">
                    <Tooltip title={c('Action').t`Delete`}>
                        <Button color="weak" shape="outline" icon onClick={handleDelete} className="inline-flex ml0-5">
                            <Icon name="trash" alt={c('Action').t`Delete`} />
                        </Button>
                    </Tooltip>
                    <Tooltip title={c('Action').t`Edit`}>
                        <Button icon shape="solid" color="norm" onClick={handleEdit} className="inline-flex ml0-5">
                            <Icon name="pen" alt={c('Action').t`Edit`} />
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <ContactGroupTable contactEmails={emails} />
        </FormModal>
    );
};

export default ContactGroupDetailsModal;
