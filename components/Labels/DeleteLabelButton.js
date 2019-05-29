import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    ConfirmModal,
    Alert,
    SmallButton,
    useModal,
    useApiWithoutResult,
    useEventManager,
    useNotifications
} from 'react-components';
import { deleteLabel } from 'proton-shared/lib/api/labels';
import { noop } from 'proton-shared/lib/helpers/function';
import { LABEL_TYPES } from 'proton-shared/lib/constants';

function DeleteLabelButton({ label, onRemove }) {
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const { request, loading } = useApiWithoutResult(deleteLabel);
    const { isOpen, open, close } = useModal();

    const handleClick = open;
    const handleCloseConfirmModal = close;

    const handleConfirmConfirmModal = async () => {
        await request(label.ID);
        call();
        createNotification({
            text: c('Filter notification').t`${label.Name} removed`
        });
        onRemove(label);
        close();
    };

    const I18N = {
        [LABEL_TYPES.LABEL]: {
            title: c('Title').t`Delete label`,
            content: c('Info')
                .t`Are you sure you want to delete this label? Removing a label will not remove the messages with that label.`
        },
        [LABEL_TYPES.FOLDER]: {
            title: c('Title').t`Delete folder`,
            content: c('Info')
                .t`Are you sure you want to delete this folder? Messages in the folders aren’t deleted if the folder is deleted, they can still be found in all mail. If you want to delete all messages in a folder, move them to trash.`
        }
    };

    return (
        <>
            <SmallButton onClick={handleClick}>{c('Action').t`Delete`}</SmallButton>
            {isOpen ? (
                <ConfirmModal
                    loading={loading}
                    onClose={handleCloseConfirmModal}
                    onConfirm={handleConfirmConfirmModal}
                    title={I18N[label.Exclusive].title}
                >
                    <Alert>{I18N[label.Exclusive].content}</Alert>
                </ConfirmModal>
            ) : null}
        </>
    );
}

DeleteLabelButton.propTypes = {
    label: PropTypes.object.isRequired,
    onRemove: PropTypes.func
};

DeleteLabelButton.defaultProps = {
    onRemove: noop
};

export default DeleteLabelButton;
