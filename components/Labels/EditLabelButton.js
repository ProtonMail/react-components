import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { SmallButton, useModal, useEventManager, useApiWithoutResult, useNotifications } from 'react-components';
import { updateLabel } from 'proton-shared/lib/api/labels';
import { noop } from 'proton-shared/lib/helpers/function';

import EditLabelModal from '../../containers/Labels/modals/Edit';

function EditLabelButton({ label, onChange, className }) {
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const { request, loading } = useApiWithoutResult(updateLabel);
    const { isOpen: isOpenModal, open: openModal, close: closeModal } = useModal();

    const handleClickAdd = openModal;
    const handleCloseModal = closeModal;

    const handleSubmitModal = async (label = {}) => {
        await request(label.ID, label);
        call();
        createNotification({
            text: c('Filter notification').t`${label.Name} updated`
        });
        onChange(label);
        closeModal();
    };

    return (
        <>
            <SmallButton onClick={handleClickAdd} className={className}>
                {c('Action').t`Edit`}
            </SmallButton>
            {isOpenModal && (
                <EditLabelModal
                    label={label}
                    loading={loading}
                    mode="edition"
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitModal}
                />
            )}
        </>
    );
}

EditLabelButton.propTypes = {
    label: PropTypes.object.isRequired,
    className: PropTypes.string,
    onChange: PropTypes.func
};

EditLabelButton.defaultProps = {
    onChange: noop
};

export default EditLabelButton;
