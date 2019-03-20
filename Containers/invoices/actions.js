import React from 'react';
import PropTypes from 'prop-types';
import { INVOICE_STATE } from 'proton-shared/lib/constants';

import DownloadInvoiceButton from './downloadButton';
import PayButton from './payButton';

const InvoiceActions = ({ invoice, fetchInvoices }) => {
    return (
        <>
            <DownloadInvoiceButton invoice={invoice} />
            {invoice.State === INVOICE_STATE.UNPAID ? (
                <PayButton invoice={invoice} fetchInvoices={fetchInvoices} />
            ) : null}
        </>
    );
};

InvoiceActions.propTypes = {
    invoice: PropTypes.object.isRequired,
    fetchInvoices: PropTypes.func.isRequired
};

export default InvoiceActions;
