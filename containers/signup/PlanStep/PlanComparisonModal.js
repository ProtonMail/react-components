import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DialogModal, HeaderModal, InnerModal, usePlans } from 'react-components';
import { c } from 'ttag';
import { CYCLE, CURRENCIES } from 'proton-shared/lib/constants';

const { MONTHLY, YEARLY, TWO_YEARS } = CYCLE;

const PlanComparisonModal = ({
    modalTitleID = 'modalTitle',
    onClose,
    defaultCycle,
    defaultCurrency,
    renderPlansTable,
    ...rest
}) => {
    const [cycle, updateCycle] = useState(defaultCycle);
    const [currency, updateCurrency] = useState(defaultCurrency);
    const [plans, loading] = usePlans();

    return (
        <DialogModal onClose={onClose} className="pm-modal--wider" {...rest}>
            <HeaderModal hasClose modalTitleID={modalTitleID} onClose={onClose}>
                {c('Title').t`ProtonVPN plan comparison`}
            </HeaderModal>
            <div className="pm-modalContent">
                <InnerModal>
                    {renderPlansTable({ expand: true, loading, currency, cycle, updateCurrency, updateCycle, plans })}
                </InnerModal>
            </div>
        </DialogModal>
    );
};

PlanComparisonModal.propTypes = {
    ...DialogModal.propTypes,
    cycle: PropTypes.oneOf([MONTHLY, TWO_YEARS, YEARLY]).isRequired,
    currency: PropTypes.oneOf(CURRENCIES).isRequired,
    renderPlansTable: PropTypes.func.isRequired
};

export default PlanComparisonModal;
