import React from 'react';
import { SmallButton, useApiWithoutResult } from 'react-components';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { getInvoice } from 'proton-shared/lib/api/payments';

const ViewInvoiceButton = ({ invoice }) => {
    const { loading, request } = useApiWithoutResult(getInvoice);

    const handleClick = async () => {
        const buffer = await request(invoice.ID);
        const filename = c('Title for PDF file').t`ProtonMail invoice` + ` ${invoice.ID}.pdf`;
        const blob = new Blob([buffer], { type: 'application/pdf' });

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob);
            return;
        }

        // For other browsers:
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = data;
        link.download = filename;
        link.click();

        setTimeout(() => {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
        }, 100);
    };

    return <SmallButton onClick={handleClick} disabled={loading}>{c('Action').t`View`}</SmallButton>;
};

ViewInvoiceButton.propTypes = {
    invoice: PropTypes.object.isRequired
};

export default ViewInvoiceButton;
