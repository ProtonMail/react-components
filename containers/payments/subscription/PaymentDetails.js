import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Price, Info, useToggle, SmallButton, useConfig } from 'react-components';
import { CYCLE, CLIENT_TYPES } from 'proton-shared/lib/constants';
import GiftCodeForm from './GiftCodeForm';

const { MONTHLY, YEARLY, TWO_YEARS } = CYCLE;
const { VPN } = CLIENT_TYPES;

const getBillingCycleI18N = () => ({
    [MONTHLY]: c('Info').t`monthly billing`,
    [YEARLY]: c('Info').t`annual billing`,
    [TWO_YEARS]: c('Info').t`two-year billing`
});

const PaymentDetails = ({ check, model, onChange }) => {
    const { CLIENT_TYPE } = useConfig();
    const { state, toggle } = useToggle();
    const i18n = getBillingCycleI18N();

    return (
        <>
            <div className="uppercase bold small mb1">{c('Title').t`Payment details`}</div>
            <div className="flex flex-spacebetween mb1 pb1 border-bottom">
                <div className="bold">
                    {c('Label').t`Total`} ({i18n[model.cycle]})
                </div>
                <div className="bold">
                    <Price currency={model.currency}>{check.Amount}</Price>
                </div>
            </div>
            {check.Credit ? (
                <div className="flex flex-spacebetween mb1 pb1 border-bottom">
                    <div>{c('Label').t`Credits`}</div>
                    <div>
                        <Price className="color-global-success" currency={model.currency}>
                            {check.Credit}
                        </Price>
                    </div>
                </div>
            ) : null}
            {check.Proration ? (
                <div className="flex flex-spacebetween mb1 pb1 border-bottom">
                    <div>
                        <span className="mr0-5">{c('Label').t`Proration`}</span>
                        <Info
                            url={
                                CLIENT_TYPE === VPN
                                    ? 'https://protonvpn.com/support/vpn-credit-proration/'
                                    : 'https://protonmail.com/support/knowledge-base/credit-proration/'
                            }
                        />
                    </div>
                    <div>
                        <Price className="color-global-success" currency={model.currency}>
                            {check.Proration}
                        </Price>
                    </div>
                </div>
            ) : null}
            {check.Gift ? (
                <div className="flex flex-spacebetween mb1 pb1 border-bottom">
                    <div>{c('Label').t`Gift`}</div>
                    <div>
                        <Price className="color-global-success" currency={model.currency}>
                            {check.Gift}
                        </Price>
                    </div>
                </div>
            ) : null}
            <div className="flex flex-spacebetween">
                <div className="bold">{c('Label').t`Amount due`}</div>
                <div className="bold">
                    <Price currency={model.currency}>{check.AmountDue}</Price>
                </div>
            </div>
            {model.gift ? null : (
                <div className="mt1">
                    {state ? (
                        <GiftCodeForm model={model} onChange={onChange} />
                    ) : (
                        <SmallButton className="pm-button--link" onClick={toggle}>{c('Action')
                            .t`Add gift code`}</SmallButton>
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
