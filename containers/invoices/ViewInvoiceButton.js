import React from 'react';
import { SmallButton, useApiWithoutResult } from 'react-components';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { getInvoice } from 'proton-shared/lib/api/payments';
import { openTabBlob } from 'proton-shared/lib/helpers/file';

const ViewInvoiceButton = ({ invoice }) => {
    const { loading, request } = useApiWithoutResult(getInvoice);

    const handleClick = async () => {
        const buffer = await request(invoice.ID);
        const filename = c('Title for PDF file').t`ProtonMail invoice` + ` ${invoice.ID}.pdf`;
        const blob = new Blob([buffer], { type: 'application/pdf' });

        openTabBlob(blob, filename);
    };

    return <SmallButton onClick={handleClick} disabled={loading}>{c('Action').t`View`}</SmallButton>;
};

ViewInvoiceButton.propTypes = {
    invoice: PropTypes.object.isRequired
};

export default ViewInvoiceButton;
