import React from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { Modal, ContentModal, FooterModal, ResetButton, useApiResult } from 'react-components';
import { getInvoice } from 'proton-shared/lib/api/payments';

const InvoiceModal = ({ show, onClose, invoice }) => {
    const { result: buffer } = useApiResult(() => getInvoice(invoice.ID), []);
    const blob = new Blob([buffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    return (
        <Modal show={show} onClose={onClose} title={c('Title').t`Add invoice details`}>
            <ContentModal onReset={onClose}>
                <iframe src={url} className="w100" height={500} />
                <FooterModal>
                    <ResetButton>{c('Action').t`Close`}</ResetButton>
                </FooterModal>
            </ContentModal>
        </Modal>
    );
};

InvoiceModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    invoice: PropTypes.object.isRequired
};

export default InvoiceModal;
