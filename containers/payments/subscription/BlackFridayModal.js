import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    classnames,
    FormModal,
    Loader,
    Button,
    Alert,
    CurrencySelector,
    useLoading,
    useApi,
    Price
} from 'react-components';
import { checkSubscription } from 'proton-shared/lib/api/payments';
import { CYCLE, DEFAULT_CURRENCY, DEFAULT_CYCLE } from 'proton-shared/lib/constants';
import { c } from 'ttag';

const { MONTHLY, YEARLY, TWO_YEARS } = CYCLE;

const BlackFridayModal = ({ bundles = [], onSelect, ...rest }) => {
    const api = useApi();
    const [loading, withLoading] = useLoading();
    const [currency, updateCurrency] = useState(DEFAULT_CURRENCY);
    const [pricing, updatePricing] = useState({});

    const DEAL_TITLE = {
        [MONTHLY]: c('Title').t`1 month deal`,
        [YEARLY]: c('Title').t`1 year deal`,
        [TWO_YEARS]: c('Title').t`2 year deal`
    };

    const BILLED_DESCRIPTION = ({ cycle, amount, notice }) =>
        ({
            [MONTHLY]: c('Title').jt`Billed as ${amount} (${notice})`,
            [YEARLY]: c('Title').jt`Billed as ${amount} (${notice})`,
            [TWO_YEARS]: c('Title').jt`Billed as ${amount} (${notice})`
        }[cycle]);

    const AFTER_INFO = ({ cycle, amount, notice }) =>
        ({
            [MONTHLY]: c('Title')
                .jt`(${notice}) After one month, your subscription will automatically renew at the regular price of ${amount} every month.`,
            [YEARLY]: c('Title')
                .jt`(${notice}) After one year, your subscription will automatically renew at the regular price of ${amount} every year.`,
            [TWO_YEARS]: c('Title')
                .jt`(${notice}) After two years, your subscription will automatically renew at the regular price of ${amount} every two years.`
        }[cycle]);

    const getBundlePrices = async () => {
        const result = await Promise.all(
            bundles.map(({ planIDs = [], cycle = DEFAULT_CYCLE, couponCode }) => {
                return Promise.all([
                    api(
                        checkSubscription({
                            PlanIDs: planIDs,
                            CouponCode: couponCode,
                            Currency: currency,
                            Cycle: cycle
                        })
                    ),
                    api(
                        checkSubscription({
                            PlanIDs: planIDs,
                            Currency: currency,
                            Cycle: MONTHLY
                        })
                    )
                ]);
            })
        );

        updatePricing(
            result.reduce((acc, [withCoupon, withoutCouponMonthly], index) => {
                acc[bundles[index].name] = {
                    withCoupon: withCoupon.Amount + withCoupon.CouponDiscount,
                    withoutCoupon: withCoupon.Amount,
                    withoutCouponMonthly: withoutCouponMonthly.Amount
                };
                return acc;
            }, {})
        );
    };

    useEffect(() => {
        withLoading(getBundlePrices());
    }, []);

    return (
        <FormModal title={c('Title').t`Black Friday sale`} loading={loading} footer={null} {...rest}>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <Alert>{c('Info').t`Don't miss out on limited time discounts for newcomers!`}</Alert>
                    <div className="flex flex-nowrap">
                        {bundles.map(({ name, cycle, planIDs, popular }, index) => {
                            const key = `${index}${name}`;
                            const { withCoupon = 0, withoutCouponMonthly = 0 } = pricing[name] || {};
                            const monthlyPrice = (
                                <Price currency={currency} suffix="/mo">
                                    {withCoupon / cycle}
                                </Price>
                            );
                            const amountDue = (
                                <Price key={key} currency={currency}>
                                    {withCoupon}
                                </Price>
                            );
                            const regularPrice = (
                                <Price key={key} currency={currency} suffix="/mo">
                                    {withoutCouponMonthly}
                                </Price>
                            );

                            return (
                                <div
                                    key={key}
                                    className={classnames([
                                        'plan bordered-container p1 mb1 flex flex-column flex-items-center flex-justify-end',
                                        index < bundles.length - 1 && 'mr1'
                                    ])}
                                >
                                    {popular ? <span>{c('Title').t`Most popular`}</span> : null}
                                    <span>{DEAL_TITLE[cycle]}</span>
                                    <strong>{name}</strong>
                                    <h1>{monthlyPrice}</h1>
                                    <small>{c('Info').jt`Regular price: ${regularPrice}`}</small>
                                    <Button
                                        onClick={() => {
                                            rest.onClose();
                                            onSelect({ planIDs, cycle, currency });
                                        }}
                                    >{c('Action').t`Get the deal`}</Button>
                                    <p>{BILLED_DESCRIPTION({ cycle, amount: amountDue, notice: index + 1 })}</p>
                                </div>
                            );
                        })}
                    </div>
                    <CurrencySelector currency={currency} onSelect={updateCurrency} />
                    {bundles.map(({ name, cycle }, index) => {
                        const key = `${index}${name}`;
                        const { withoutCoupon = 0 } = pricing[name] || {};
                        const amount = (
                            <Price key={key} currency={currency}>
                                {withoutCoupon}
                            </Price>
                        );
                        return <p key={key}>{AFTER_INFO({ cycle, notice: index + 1, amount })}</p>;
                    })}
                </>
            )}
        </FormModal>
    );
};

BlackFridayModal.propTypes = {
    onSelect: PropTypes.func.isRequired,
    bundles: PropTypes.arrayOf(
        PropTypes.shape({
            planIDs: PropTypes.arrayOf(PropTypes.string).isRequired,
            name: PropTypes.string.isRequired,
            cycle: PropTypes.oneOf([MONTHLY, YEARLY, TWO_YEARS]).isRequired,
            couponCode: PropTypes.string,
            pourcentage: PropTypes.number,
            popular: PropTypes.bool
        })
    )
};

export default BlackFridayModal;
