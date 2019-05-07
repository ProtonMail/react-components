import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Price, Info, useToggle, Button } from 'react-components';
import { CYCLE } from 'proton-shared/lib/constants';
import GiftCodeForm from './GiftCodeForm';

const { MONTHLY, YEARLY, TWO_YEAR } = CYCLE;

const BILLING_CYCLE = {
    [MONTHLY]: c('Info').t`monthly billing`,
    [YEARLY]: c('Info').t`annual billing`,
    [TWO_YEAR]: c('Info').t`two year billing`
};

const PaymentDetails = ({ check, model, onChange }) => {
    const { state, toggle } = useToggle();

    return (
        <>
            <h4>{c('Title').t`Payment details`}</h4>
            <div className="flex flex-spacebetween mb1">
                <div className="bold">
                    {c('Label').t`Total`} ({BILLING_CYCLE[model.cycle]})
                </div>
                <div className="bold">
                    <Price currency={model.currency}>{check.Amount}</Price>
                </div>
            </div>
            {check.Credit ? (
                <div className="flex flex-spacebetween mb1">
                    <div>{c('Label').t`Credits`}</div>
                    <div>
                        <Price className="color-global-success" currency={model.currency}>
                            {check.Credit}
                        </Price>
                    </div>
                </div>
            ) : null}
            {check.Proration ? (
                <div className="flex flex-spacebetween mb1">
                    <div>
                        {c('Label').t`Proration`}{' '}
                        <Info url="https://protonmail.com/support/knowledge-base/credit-proration/" />
                    </div>
                    <div>
                        <Price className="color-global-success" currency={model.currency}>
                            {check.Proration}
                        </Price>
                    </div>
                </div>
            ) : null}
            {check.Gift ? (
                <div className="flex flex-spacebetween mb1">
                    <div>{c('Label').t`Gift`}</div>
                    <div>
                        <Price className="color-global-success" currency={model.currency}>
                            {check.Gift}
                        </Price>
                    </div>
                </div>
            ) : null}
            <div className="flex flex-spacebetween mb1">
                <div className="bold">{c('Label').t`Amount due`}</div>
                <div className="bold">
                    <Price currency={model.currency}>{check.AmountDue}</Price>
                </div>
            </div>
            {model.gift ? null : (
                <div className="mb1">
                    {state ? (
                        <GiftCodeForm model={model} onChange={onChange} />
                    ) : (
                        <Button onClick={toggle}>{c('Action').t`Add gift code`}</Button>
                    )}
                </div>
            )}
        </>
    );
};

PaymentDetails.propTypes = {
    check: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default PaymentDetails;
