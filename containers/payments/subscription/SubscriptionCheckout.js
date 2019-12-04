import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { CurrencySelector, CycleSelector, PrimaryButton, Icon } from 'react-components';

const SubscriptionCheckout = ({ model, setModel, onCheckout }) => {
    return (
        <>
            <div className="flex flex-nowrap mb1">
                <CurrencySelector
                    className="mr1"
                    currency={model.currency}
                    onSelect={(newCurrency) => setModel({ ...model, currency: newCurrency })}
                />
                <CycleSelector cycle={model.cycle} onSelect={(newCycle) => setModel({ ...model, cycle: newCycle })} />
            </div>
            <div className="rounded mb1">
                <header className="small mt0 mb0 bg-global-border uppercase pl1 pr1 pt0-5 pb0-5">{c('Title')
                    .t`Plan summary`}</header>
                <div className="bg-global-light p1"></div>
            </div>
            <div className="rounded p1 mb1 bg-global-light">
                <div>
                    <PrimaryButton onClick={onCheckout} className="w100 pm-button--large">{c('Action')
                        .t`Checkout`}</PrimaryButton>
                </div>
            </div>
            <div className="aligncenter">
                <div className="flex flex-nowrap flex-items-center flex-justify-center">
                    <Icon name="clock" className="mr0-5" />
                    {c('Info').t`Guarantee`}
                </div>
                <div className="small mb1 mt0">{c('Info').t`30-days money back guaranteed`}</div>
                <div className="flex flex-nowrap flex-items-center flex-justify-center">
                    <Icon name="lock" className="mr0-5" />
                    {c('Info').t`Secure`}
                </div>
                <div className="small mb1 mt0">{c('Info')
                    .t`Payments are protected with TLS encryption and Swiss privacy laws`}</div>
            </div>
        </>
    );
};

SubscriptionCheckout.propTypes = {
    model: PropTypes.object.isRequired,
    setModel: PropTypes.func.isRequired,
    onCheckout: PropTypes.func.isRequired
};

export default SubscriptionCheckout;
