import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    Button,
    ConfirmModal,
    Alert,
    useApiWithoutResult,
    useModal,
    useNotifications,
    useEventManager
} from 'react-components';
import { deleteFilter } from 'proton-shared/lib/api/filters';
import { noop } from 'proton-shared/lib/helpers/function';

function RemoveFilter({ filter, className, onRemoveFilter }) {
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const { request, loading } = useApiWithoutResult(deleteFilter);
    const { isOpen: isOpenConfirmModal, open: openConfirmModal, close: closeConfirmModal } = useModal();

    const handelClick = openConfirmModal;
    const handleCloseConfirmModal = closeConfirmModal;

    const handleConfirmConfirmModal = async () => {
        await request(filter.ID);
        call();
        closeConfirmModal();
        createNotification({
            text: c('Filter notification').t('Filter removed')
        });
        onRemoveFilter(filter);
    };

    return (
        <>
            <Button className={className} onClick={handelClick}>
                {c('Action').t('Delete')}
            </Button>
            {isOpenConfirmModal ? (
                <ConfirmModal
                    loading={loading}
                    onClose={handleCloseConfirmModal}
                    onConfirm={handleConfirmConfirmModal}
                    title={c('Title').t`Delete Filter`}
                >
                    <Alert>{c('Info').t`Are you sure you want to delete this filter?`}</Alert>
                </ConfirmModal>
            ) : null}
        </>
    );
}

RemoveFilter.propTypes = {
    filter: PropTypes.object.isRequired,
    className: PropTypes.string,
    onRemoveFilter: PropTypes.func
};

RemoveFilter.defaultProps = {
    onRemoveFilter: noop
};

export default RemoveFilter;
