import React from 'react';
import { c, msgid } from 'ttag';

import { noop } from 'proton-shared/lib/helpers/function';
import { wait } from 'proton-shared/lib/helpers/promise';
import { ContactGroup } from 'proton-shared/lib/interfaces/contacts';
import { deleteLabel } from 'proton-shared/lib/api/labels';

import { useApi, useContactGroups, useEventManager, useLoading, useNotifications } from '../../../hooks';
import { Alert, ErrorButton, FormModal } from '../../../components';

interface Props {
    groupIDs: string[];
    onDelete?: () => void;
    onClose?: () => void;
}

const ContactGroupDeleteModal = ({ groupIDs = [], onDelete, onClose = noop, ...rest }: Props) => {
    const api = useApi();
    const { createNotification } = useNotifications();
    const { call } = useEventManager();
    const [loadingDelete, withLoadingDelete] = useLoading();
    const [groups = []] = useContactGroups();

    const submit = <ErrorButton type="submit" loading={loadingDelete}>{c('Action').t`Delete`}</ErrorButton>;

    const handleDelete = async () => {
        // Call the callback and close the modal and wait a bit to trigger the event manager
        // In order eventual contact view can be closed and will not try to request the contact
        const delayedClosing = async () => {
            onDelete?.();
            onClose();
            await wait(1000);
            await call();
        };

        const apiSuccess = await Promise.all(groupIDs.map((groupID) => api(deleteLabel(groupID))));
        void delayedClosing();
        if (!apiSuccess) {
            return createNotification({
                text: c('Error').t`Some contacts groups could not be deleted`,
                type: 'warning',
            });
        }
        createNotification({
            text: c('Success').ngettext(msgid`Contact group deleted`, `Contacts groups deleted`, groupIDs.length),
        });
    };

    const count = groupIDs.length;
    const group = groups.find((group: ContactGroup) => group.ID === groupIDs[0]);
    const Name = group?.Name || '';
    const title =
        count === 1
            ? c('Title').t`Delete ${Name}`
            : c('Title').ngettext(msgid`Delete ${count} contact group`, `Delete ${count} contacts groups`, count);

    return (
        <FormModal
            title={title}
            onSubmit={() => withLoadingDelete(handleDelete())}
            onClose={onClose}
            submit={submit}
            loading={loadingDelete}
            className="modal--smaller"
            {...rest}
        >
            <Alert type="info">
                {c('Info').t`Please note that addresses assigned to this group will NOT be deleted.`}
            </Alert>
            <Alert type="error">{c('Info').t`Are you sure you want to permanently delete this contact group?`}</Alert>
        </FormModal>
    );
};

export default ContactGroupDeleteModal;
