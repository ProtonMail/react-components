import React from 'react';
import PropTypes from 'prop-types';
import { DialogModal, ContentModal } from 'react-components';

const SimpleFormModal = ({ modalTitleID = 'modalTitle', children, onSubmit, onClose, ...rest }) => {
    return (
        <DialogModal modalTitleID={modalTitleID} {...rest}>
            <ContentModal onSubmit={onSubmit} onReset={onClose}>
                {children}
            </ContentModal>
        </DialogModal>
    );
};

SimpleFormModal.propTypes = {
    ...DialogModal.propTypes,
    children: PropTypes.node.isRequired,
    onSubmit: PropTypes.func,
    onClose: PropTypes.func.isRequired
};

export default SimpleFormModal;
