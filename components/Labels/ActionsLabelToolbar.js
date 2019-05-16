import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    PrimaryButton,
    Icon,
    useModal,
    useApiWithoutResult,
    useEventManager,
    useNotifications
} from 'react-components';
import { createLabel } from 'proton-shared/lib/api/labels';
import { noop } from 'proton-shared/lib/helpers/function';

import EditLabelModal from '../../containers/Labels/modals/Edit';

function ActionsLabelToolbar({ onAdd }) {
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const { request, loading } = useApiWithoutResult(createLabel);
    const [type, setType] = useState('');
    const { isOpen: isOpenModal, open: openModal, close: closeModal } = useModal();

    const handleClickAdd = (type) => () => {
        setType(type);
        openModal();
    };
    const handleCloseModal = closeModal;

    const handleSubmitModal = async (label = {}) => {
        const { Label } = await request(label);
        call();
        createNotification({
            text: c('label/folder notification').t`${Label.Name} created`
        });
        onAdd(Label);
        closeModal();
    };

    return (
        <>
            <PrimaryButton onClick={handleClickAdd('folder')}>
                <Icon name="folder" style={{ fill: 'currentColor' }} className="mr0-5" />
                {c('Action').t`Add Folder`}
            </PrimaryButton>
            <PrimaryButton onClick={handleClickAdd('label')} className="ml1">
                <Icon name="label" style={{ fill: 'currentColor' }} className="mr0-5" />
                {c('Action').t`Add Label`}
            </PrimaryButton>

            {isOpenModal && (
                <EditLabelModal
                    show={isOpenModal}
                    loading={loading}
                    type={type}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitModal}
                />
            )}
        </>
    );
}

ActionsLabelToolbar.propTypes = {
    onAdd: PropTypes.func,
    onSort: PropTypes.func
};

ActionsLabelToolbar.defaultProps = {
    onAdd: noop,
    onSort: noop
};

export default ActionsLabelToolbar;
