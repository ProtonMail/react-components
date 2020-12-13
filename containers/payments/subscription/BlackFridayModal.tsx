import React, { useEffect, useState } from 'react';
import { checkSubscription } from 'proton-shared/lib/api/payments';
import { CYCLE, DEFAULT_CURRENCY, DEFAULT_CYCLE, BLACK_FRIDAY, SECOND } from 'proton-shared/lib/constants';
import { c } from 'ttag';
import { isAfter } from 'date-fns';
import { Cycle, PlanIDs } from 'proton-shared/lib/interfaces';
import { isProductPayer } from 'proton-shared/lib/helpers/blackfriday';

import { FormModal, Loader, Countdown, Button, Price } from '../../../components';
import { useLoading, useApi, useSubscription } from '../../../hooks';
import { classnames } from '../../../helpers';
import CurrencySelector from '../CurrencySelector';

const { MONTHLY, YEARLY, TWO_YEARS } = CYCLE;
const EVERY_SECOND = SECOND;

export interface Bundle {
    planIDs: PlanIDs;
    name: string;
    cycle: Cycle;
    couponCode?: string;
    percentage?: number;
    popular?: boolean;
}

interface Props<T> {
    onSelect: (bundle: Bundle) => void;
    bundles: Bundle[];
    className?: string;
}

interface Pricing {
    [index: number]: {
        withCoupon: number;
        withoutCoupon: number;
        withoutCouponMonthly: number;
    };
}

const BlackFridayModal = <T,>({ bundles = [], onSelect, ...rest }: Props<T>) => {
    const api = useApi();
    const [subscription] = useSubscription();
    const productPayer = isProductPayer(subscription);
    const [loading, withLoading] = useLoading();
    const [currency, updateCurrency] = useState(DEFAULT_CURRENCY);
    const [pricing, updatePricing] = useState<Pricing>({});
    const [now, setNow] = useState(new Date());

    const DEAL_TITLE = {
        [MONTHLY]: c('Title').t`for 1 month`,
        [YEARLY]: c('Title').t`for 1 year`,
        [TWO_YEARS]: c('Title').t`for 2 years`,
    };

    const BILLED_DESCRIPTION = ({ cycle, amount }: { cycle: Cycle; amount: React.ReactNode }) =>
        ({
            [MONTHLY]: c('Title').jt`Billed as ${amount}`,
            [YEARLY]: c('Title').jt`Billed as ${amount}`,
            [TWO_YEARS]: c('Title').jt`Billed as ${amount}`,
        }[cycle]);

    const getTitle = () => {
        if (productPayer) {
            return c('Title').t`ProtonDrive early access offer`;
        }
        return c('Title').t`Black Friday Sale`;
    };

    const getCTA = () => {
        if (productPayer) {
            return c('Action').t`Upgrade`;
        }
        return c('Action').t`Get limited-time deal`;
    };

    const getDescription = () => {
        if (productPayer) {
            return (
                <p>{c('Info')
                    .t`Get early access to our new encrypted drive for FREE by upgrading to a Plus bundle now.`}</p>
            );
        }
        return (
            <div className="bold big aligncenter mt0 blackfriday-countdown-container">
                <Countdown end={isAfter(now, BLACK_FRIDAY.CYBER_START) ? BLACK_FRIDAY.END : BLACK_FRIDAY.CYBER_START} />
            </div>
        );
    };

    const getBundlePrices = async () => {
        const result = await Promise.all(
            bundles.map(({ planIDs = [], cycle = DEFAULT_CYCLE, couponCode }) => {
                return Promise.all([
                    api(
                        checkSubscription({
                            PlanIDs: planIDs,
                            CouponCode: couponCode,
                            Currency: currency,
                            Cycle: cycle,
                        })
                    ),
                    api(
                        checkSubscription({
                            PlanIDs: planIDs,
                            Currency: currency,
                            Cycle: cycle,
                        })
                    ),
                    api(
                        checkSubscription({
                            PlanIDs: planIDs,
                            Currency: currency,
                            Cycle: MONTHLY,
                        })
                    ),
                ]);
            })
        );

        updatePricing(
            result.reduce<Pricing>((acc, [withCoupon, withoutCoupon, withoutCouponMonthly], index) => {
                acc[index] = {
                    withCoupon: withCoupon.Amount + withCoupon.CouponDiscount,
                    withoutCoupon: withoutCoupon.Amount + withoutCoupon.CouponDiscount, // BUNDLE discount can be applied
                    withoutCouponMonthly: withoutCouponMonthly.Amount,
                };
                return acc;
            }, {})
        );
    };

    useEffect(() => {
        withLoading(getBundlePrices());
    }, []);

    useEffect(() => {
        const intervalID = setInterval(() => {
            setNow(new Date());
        }, EVERY_SECOND);

        return () => {
            clearInterval(intervalID);
        };
    }, []);

    return (
        <FormModal title={getTitle()} loading={loading} footer={null} {...rest}>
            {loading ? (
                <Loader />
            ) : (
                <>
                    {getDescription()}
                    <div className="flex-autogrid onmobile-flex-column flex-items-end">
                        {bundles.map(({ name, cycle, planIDs, popular, couponCode }, index) => {
                            const key = `${index}`;
                            const { withCoupon = 0, withoutCouponMonthly = 0 } = pricing[index] || {};
                            const withCouponMonthly = withCoupon / cycle;
                            const percentage = 100 - Math.round((withCouponMonthly * 100) / withoutCouponMonthly);
                            const monthlyPrice = (
                                <Price currency={currency} className="blackfriday-monthly-price" suffix="/mo">
                                    {withCoupon / cycle}
                                </Price>
                            );
                            const amountDue = (
                                <Price key={key} currency={currency}>
                                    {withCoupon}
                                </Price>
                            );
                            const regularPrice = (
                                <del key={key}>
                                    <Price currency={currency}>{withoutCouponMonthly * cycle}</Price>
                                </del>
                            );

                            return (
                                <div key={key} className="flex-autogrid-item relative blackfriday-plan-container">
                                    {percentage ? (
                                        <span className="uppercase bold mb1 mr0 absolute bg-global-warning color-white blackfriday-percentage aligncenter">
                                            {`${percentage}% off`}
                                        </span>
                                    ) : null}
                                    {popular ? (
                                        <div className="uppercase bold rounded bg-primary color-white pt1 pb1 mt0 mb0 aligncenter">{c(
                                            'Title'
                                        ).t`Most popular`}</div>
                                    ) : null}
                                    <div className="blackfriday-plan bordered-container p1 mb1 flex flex-column flex-items-center flex-justify-end">
                                        <strong className="aligncenter big mt0 mb0">{name}</strong>
                                        <strong>{DEAL_TITLE[cycle]}</strong>
                                        <div className={classnames(['h2 mb0', popular && 'color-primary bold'])}>
                                            {monthlyPrice}
                                        </div>
                                        <Button
                                            className={classnames([
                                                'mb1',
                                                popular ? 'pm-button--primary' : 'pm-button--primaryborder',
                                            ])}
                                            onClick={() => {
                                                rest.onClose?.();
                                                onSelect({ planIDs, cycle, currency, couponCode });
                                            }}
                                        >
                                            {getCTA()}
                                        </Button>
                                        <small>{BILLED_DESCRIPTION({ cycle, amount: amountDue })}</small>
                                        <small className="mb1">{c('Info').jt`Standard price: ${regularPrice}`}</small>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mb1 aligncenter">
                        <CurrencySelector
                            id="currency-select"
                            mode="buttons"
                            currency={currency}
                            onSelect={updateCurrency}
                        />
                    </div>
                    <p className="smaller opacity-50 aligncenter">{c('Info')
                        .t`Offer valid only for first-time paid subscriptions.`}</p>
                    <p className="smaller mt0 mb0 opacity-50 aligncenter">{c('Info')
                        .t`Subscriptions automatically renew at the same rate until cancelled.`}</p>
                    <p className="smaller mt0 mb0 opacity-50 aligncenter">{c('Info')
                        .t`Discounts are calculated based off of monthly subscriptions prices.`}</p>
                    <p className="smaller mt0 mb0 opacity-50 aligncenter">{c('Info')
                        .t`The Plus Bundle subscription includes 5 GB of storage shared between your ProtonMail and ProtonDrive accounts.`}</p>
                </>
            )}
        </FormModal>
    );
};

export default BlackFridayModal;
