import { getCalendars } from 'proton-shared/lib/models/calendarsModel';
import React, { useState, useEffect } from 'react';
import { c } from 'ttag';
import {
    APPS,
    DEFAULT_CURRENCY,
    DEFAULT_CYCLE,
    PAYMENT_METHOD_TYPES,
    PLAN_SERVICES,
} from 'proton-shared/lib/constants';
import { checkSubscription, subscribe, deleteSubscription } from 'proton-shared/lib/api/payments';
import { hasBonuses } from 'proton-shared/lib/helpers/organization';
import { getPlanIDs } from 'proton-shared/lib/helpers/subscription';
import { hasPlanIDs } from 'proton-shared/lib/helpers/planIDs';
import { API_CUSTOM_ERROR_CODES } from 'proton-shared/lib/errors';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';
import { Cycle, Currency, PlanIDs, SubscriptionCheckResponse } from 'proton-shared/lib/interfaces';
import { Calendar, CalendarUrlsResponse } from 'proton-shared/lib/interfaces/calendar';
import { MAX_CALENDARS_PER_FREE_USER } from 'proton-shared/lib/calendar/constants';

import { Alert, FormModal } from '../../../components';
import {
    usePlans,
    useApi,
    useLoading,
    useEventManager,
    useUser,
    useNotifications,
    useOrganization,
    useSubscription,
    useModals,
    useConfig,
    useVPNCountriesCount,
} from '../../../hooks';
import { classnames } from '../../../helpers';
import LossLoyaltyModal from '../LossLoyaltyModal';
import GenericError from '../../error/GenericError';
import usePayment from '../usePayment';
import Payment from '../Payment';
import PlanSelection from './PlanSelection';
import { SUBSCRIPTION_STEPS } from './constants';
import SubscriptionSubmitButton from './SubscriptionSubmitButton';
import SubscriptionUpgrade from './SubscriptionUpgrade';
import SubscriptionThanks from './SubscriptionThanks';
import SubscriptionCheckout from './SubscriptionCheckout';
import './SubscriptionModal.scss';
import { handlePaymentToken } from '../paymentTokenHelper';
import PlanCustomization from './PlanCustomization';
import SubscriptionModalHeader from './SubscriptionModalHeader';
import CalendarDowngradeModal from './CalendarDowngradeModal';

interface Props {
    step?: SUBSCRIPTION_STEPS;
    cycle?: Cycle;
    currency?: Currency;
    planIDs?: PlanIDs;
    onClose?: (e?: any) => void;
    coupon?: string | null;
}

interface Model {
    step: SUBSCRIPTION_STEPS;
    service: PLAN_SERVICES;
    planIDs: PlanIDs;
    currency: Currency;
    cycle: Cycle;
    coupon?: string | null;
    gift?: string;
}

const BACK: Partial<{ [key in SUBSCRIPTION_STEPS]: SUBSCRIPTION_STEPS }> = {
    [SUBSCRIPTION_STEPS.CHECKOUT]: SUBSCRIPTION_STEPS.CUSTOMIZATION,
};

const SubscriptionModal = ({
    step = SUBSCRIPTION_STEPS.PLAN_SELECTION,
    cycle = DEFAULT_CYCLE,
    currency = DEFAULT_CURRENCY,
    coupon,
    planIDs = {},
    onClose,
    ...rest
}: Props) => {
    const TITLE = {
        [SUBSCRIPTION_STEPS.NETWORK_ERROR]: c('Title').t`Network error`,
        [SUBSCRIPTION_STEPS.PLAN_SELECTION]: c('Title').t`Select a plan`,
        [SUBSCRIPTION_STEPS.CUSTOMIZATION]: c('Title').t`Customize your plan`,
        [SUBSCRIPTION_STEPS.CHECKOUT]: c('Title').t`Checkout`,
        [SUBSCRIPTION_STEPS.UPGRADE]: '',
        [SUBSCRIPTION_STEPS.THANKS]: '',
    };

    const api = useApi();
    const { APP_NAME } = useConfig();
    const isVpnApp = APP_NAME === APPS.PROTONVPN_SETTINGS;
    const [user] = useUser();
    const [subscription, loadingSubscription] = useSubscription();
    const [vpnCountries] = useVPNCountriesCount();
    const { call } = useEventManager();
    const { createModal } = useModals();
    const { createNotification } = useNotifications();
    const [plans = [], loadingPlans] = usePlans();
    const [organization, loadingOrganization] = useOrganization();
    const [loading, withLoading] = useLoading();
    const [loadingCheck, withLoadingCheck] = useLoading();
    const [checkResult, setCheckResult] = useState<SubscriptionCheckResponse>();
    const { Code: couponCode } = checkResult?.Coupon || {}; // Coupon can be null
    const creditsRemaining = (user.Credit + (checkResult?.Credit ?? 0)) / 100;
    const currentService = isVpnApp ? PLAN_SERVICES.VPN : PLAN_SERVICES.MAIL;
    const [model, setModel] = useState<Model>({
        service: currentService,
        step,
        cycle,
        currency,
        coupon,
        planIDs,
    });

    const TOTAL_ZERO = {
        Amount: 0,
        AmountDue: 0,
        CouponDiscount: 0,
        Currency: model.currency,
        Cycle: model.cycle,
        Proration: 0,
        Gift: 0,
        Credit: 0,
    } as SubscriptionCheckResponse;

    const getCodes = ({ gift, coupon }: Model) => [gift, coupon].filter(isTruthy);

    const handleUnsubscribe = async () => {
        const calendars: Calendar[] = await getCalendars(api);
        const hasLinks = !!(
            await Promise.all(
                (calendars || []).map((calendar) => api<CalendarUrlsResponse>(getPublicLinks(calendar.ID)))
            )
        ).flat().length;

        if (calendars.length > MAX_CALENDARS_PER_FREE_USER || hasLinks) {
            await new Promise<void>((resolve, reject) => {
                const handleClose = () => {
                    onClose?.();
                    reject();
                };
                createModal(<CalendarDowngradeModal onSubmit={resolve} onClose={handleClose} />);
            });
        }
        if (hasBonuses(organization)) {
            await new Promise<void>((resolve, reject) => {
                createModal(<LossLoyaltyModal organization={organization} onConfirm={resolve} onClose={reject} />);
            });
        }
        await api(deleteSubscription());
        await call();
        onClose?.();
        createNotification({ text: c('Success').t`You have successfully unsubscribed` });
    };

    const handleSubscribe = async (params = {}) => {
        if (!hasPlanIDs(model.planIDs)) {
            return handleUnsubscribe();
        }

        try {
            setModel({ ...model, step: SUBSCRIPTION_STEPS.UPGRADE });
            await api(
                subscribe({
                    PlanIDs: model.planIDs,
                    Codes: getCodes(model),
                    Cycle: model.cycle,
                    ...params, // Contains Payment, Amount and Currency
                })
            );
            await call();
            setModel({ ...model, step: SUBSCRIPTION_STEPS.THANKS });
        } catch (error) {
            const { Code = 0 } = error.data || {};

            if (Code === API_CUSTOM_ERROR_CODES.PAYMENTS_SUBSCRIPTION_AMOUNT_MISMATCH) {
                await check(); // eslint-disable-line @typescript-eslint/no-use-before-define
                createNotification({ text: c('Error').t`Checkout expired, please try again.`, type: 'error' });
            }
            setModel({ ...model, step: SUBSCRIPTION_STEPS.CHECKOUT });
            throw error;
        }
    };

    const { card, setCard, errors, method, setMethod, parameters, canPay, paypal, paypalCredit } = usePayment({
        amount: model.step === SUBSCRIPTION_STEPS.CHECKOUT ? checkResult?.AmountDue || 0 : 0, // Define amount only in the payment step to generate payment tokens
        currency: checkResult?.Currency || DEFAULT_CURRENCY,
        onPay(params) {
            return withLoading(handleSubscribe(params));
        },
    });

    const check = async (newModel: Model = model, wantToApplyNewGiftCode: boolean = false): Promise<void> => {
        const copyNewModel = { ...newModel };

        if (!hasPlanIDs(newModel.planIDs)) {
            setCheckResult(TOTAL_ZERO);
            setModel(copyNewModel);
            return;
        }

        try {
            const result = await api<SubscriptionCheckResponse>(
                checkSubscription({
                    PlanIDs: newModel.planIDs,
                    Currency: newModel.currency,
                    Cycle: newModel.cycle,
                    Codes: getCodes(newModel),
                })
            );

            const { Gift = 0 } = result;
            const { Code = '' } = result.Coupon || {}; // Coupon can equal null

            if (wantToApplyNewGiftCode && newModel.gift !== Code && !Gift) {
                createNotification({ text: c('Error').t`Invalid code`, type: 'error' });
            }

            copyNewModel.coupon = Code;

            if (!Gift) {
                delete copyNewModel.gift;
            }

            setModel(copyNewModel);
            setCheckResult(result);
        } catch (error) {
            if (error.name === 'OfflineError') {
                setModel({ ...model, step: SUBSCRIPTION_STEPS.NETWORK_ERROR });
            }
            if (model.step === SUBSCRIPTION_STEPS.CUSTOMIZATION) {
                if (newModel.gift && newModel.gift !== model.gift) {
                    return check({ ...model });
                }
                return check({
                    ...model,
                    planIDs: getPlanIDs(subscription),
                });
            }
        }
    };

    const handleCheckout = async () => {
        if (model.step === SUBSCRIPTION_STEPS.CUSTOMIZATION) {
            return setModel({ ...model, step: SUBSCRIPTION_STEPS.CHECKOUT });
        }

        const params = await handlePaymentToken({
            params: {
                Amount: checkResult?.AmountDue || 0,
                Currency: model.currency,
                ...parameters,
            },
            createModal,
            api,
        });

        return handleSubscribe(params);
    };

    const handleClose = (e: any) => {
        if (model.step === SUBSCRIPTION_STEPS.CHECKOUT) {
            setModel({ ...model, step: SUBSCRIPTION_STEPS.CUSTOMIZATION });
            return;
        }

        onClose?.(e);
    };

    const handleGift = (gift = '') => {
        if (!gift) {
            const withoutGift = { ...model };
            delete withoutGift.gift;
            return withLoadingCheck(check(withoutGift));
        }
        void withLoadingCheck(check({ ...model, gift }, true));
    };

    useEffect(() => {
        void withLoadingCheck(check());
    }, [model.cycle, model.currency]);

    const backStep = BACK[model.step];
    const isFreeUserWithFreePlanSelected = user.isFree && !Object.keys(model.planIDs).length;

    const submitButton = (
        <SubscriptionSubmitButton
            onClose={onClose}
            canPay={canPay}
            paypal={paypal}
            step={model.step}
            loading={loadingCheck || loading}
            method={method}
            checkResult={checkResult}
            className="w100"
            disabled={isFreeUserWithFreePlanSelected}
        />
    );

    const subscriptionCheckout = (
        <div className="subscriptionCheckout-column bg-weak on-mobile-w100">
            <div className="subscriptionCheckout-container">
                <SubscriptionCheckout
                    submit={submitButton}
                    plans={plans}
                    service={currentService}
                    checkResult={checkResult}
                    loading={loadingCheck}
                    currency={model.currency}
                    cycle={model.cycle}
                    planIDs={model.planIDs}
                    gift={model.gift}
                    coupon={model.coupon}
                    onChangeCurrency={(currency) => setModel({ ...model, currency })}
                    onChangeCycle={(cycle) => setModel({ ...model, cycle })}
                    onChangeGift={handleGift}
                />
            </div>
        </div>
    );

    return (
        <FormModal
            footer={null}
            className={classnames([
                'subscription-modal',
                [
                    SUBSCRIPTION_STEPS.PLAN_SELECTION,
                    SUBSCRIPTION_STEPS.CUSTOMIZATION,
                    SUBSCRIPTION_STEPS.CHECKOUT,
                ].includes(model.step) && 'modal--full',
                user.isFree && 'is-free-user',
            ])}
            title={
                <SubscriptionModalHeader
                    title={TITLE[model.step]}
                    onBack={backStep !== undefined ? () => setModel({ ...model, step: backStep }) : undefined}
                />
            }
            loading={loading || loadingPlans || loadingOrganization || loadingSubscription}
            onSubmit={() => withLoading(handleCheckout())}
            onClose={handleClose}
            {...rest}
        >
            {model.step === SUBSCRIPTION_STEPS.NETWORK_ERROR && <GenericError />}
            {model.step === SUBSCRIPTION_STEPS.PLAN_SELECTION && (
                <PlanSelection
                    loading={loadingCheck}
                    plans={plans}
                    currency={model.currency}
                    cycle={model.cycle}
                    planIDs={model.planIDs}
                    organization={organization}
                    subscription={subscription}
                    vpnCountries={vpnCountries}
                    service={model.service}
                    onChangePlanIDs={(planIDs) =>
                        withLoadingCheck(check({ ...model, planIDs, step: SUBSCRIPTION_STEPS.CUSTOMIZATION }))
                    }
                    onChangeCurrency={(currency) => setModel({ ...model, currency })}
                    onChangeCycle={(cycle) => setModel({ ...model, cycle })}
                />
            )}
            {model.step === SUBSCRIPTION_STEPS.CUSTOMIZATION && (
                <div className="flex-no-min-children on-mobile-flex-column">
                    <div className="flex-item-fluid on-mobile-w100 on-tablet-landscape-pr1 on-mobile-pr0">
                        <div className="mlauto mrauto max-w50e">
                            <PlanCustomization
                                plans={plans}
                                loading={loadingCheck}
                                currency={model.currency}
                                cycle={model.cycle}
                                planIDs={model.planIDs}
                                subscription={subscription}
                                organization={organization}
                                service={currentService}
                                onChangePlanIDs={(planIDs) => withLoadingCheck(check({ ...model, planIDs }))}
                                onChangeCycle={(cycle) => setModel({ ...model, cycle })}
                                onBack={(service: PLAN_SERVICES) =>
                                    setModel({ ...model, service, step: SUBSCRIPTION_STEPS.PLAN_SELECTION })
                                }
                            />
                        </div>
                    </div>
                    {subscriptionCheckout}
                </div>
            )}
            {model.step === SUBSCRIPTION_STEPS.CHECKOUT && (
                <div className="flex-no-min-children on-mobile-flex-column">
                    <div className="flex-item-fluid on-mobile-w100 on-tablet-landscape-pr1 on-mobile-pr0">
                        <div className="mlauto mrauto max-w37e on-mobile-max-w100  ">
                            {checkResult?.AmountDue ? (
                                <>
                                    <Payment
                                        type="subscription"
                                        paypal={paypal}
                                        paypalCredit={paypalCredit}
                                        method={method}
                                        amount={checkResult.AmountDue}
                                        currency={checkResult.Currency}
                                        coupon={couponCode}
                                        card={card}
                                        onMethod={setMethod}
                                        onCard={setCard}
                                        errors={errors}
                                    />
                                    {method &&
                                    [PAYMENT_METHOD_TYPES.CASH, PAYMENT_METHOD_TYPES.BITCOIN].includes(
                                        method as any
                                    ) ? (
                                        <Alert type="warning">{c('Warning')
                                            .t`Please note that by choosing this payment method, your account cannot be upgraded immediately. We will update your account once the payment is cleared.`}</Alert>
                                    ) : null}
                                </>
                            ) : (
                                <>
                                    <Alert>{c('Info').t`No payment is required at this time.`}</Alert>
                                    {checkResult?.Credit && creditsRemaining ? (
                                        <Alert>{c('Info')
                                            .t`Please note that upon clicking the Confirm button, your account will have ${creditsRemaining} credits remaining.`}</Alert>
                                    ) : null}
                                </>
                            )}
                        </div>
                    </div>
                    {subscriptionCheckout}
                </div>
            )}
            {model.step === SUBSCRIPTION_STEPS.UPGRADE && (
                <div className="text-center">
                    <SubscriptionUpgrade />
                </div>
            )}
            {model.step === SUBSCRIPTION_STEPS.THANKS && <SubscriptionThanks method={method} onClose={onClose} />}
        </FormModal>
    );
};

export default SubscriptionModal;
