import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    usePlans,
    Modal,
    ContentModal,
    FooterModal,
    Button,
    ResetButton,
    Price,
    PrimaryButton,
    usePayment,
    Payment,
    Paragraph,
    useStep,
    useApiWithoutResult,
    useEventManager,
    useNotifications,
    SubTitle,
    Label,
    Row,
    Field
} from 'react-components';
import { DEFAULT_CURRENCY, DEFAULT_CYCLE } from 'proton-shared/lib/constants';
import { checkSubscription, subscribe } from 'proton-shared/lib/api/payments';

import CustomMailSection from './CustomMailSection';
import CustomVPNSection from './CustomVPNSection';
import OrderSummary from './OrderSummary';
import FeaturesList from './FeaturesList';

const convert = ({ plansMap, cycle, plans }) => {
    return Object.entries(plansMap).reduce((acc, [planName, quantity]) => {
        if (quantity) {
            const { ID } = plans.find(({ Cycle, Name }) => Name === planName && Cycle === cycle);
            acc[ID] = quantity;
        }

        return acc;
    }, Object.create(null));
};

const toParams = (model, plans) => ({
    GiftCode: model.gift,
    PlanIDs: convert({ ...model, plans }),
    CouponCode: model.coupon,
    Currency: model.currency,
    Cycle: model.cycle
});

const SubscriptionModal = ({ onClose, cycle, currency, step: initialStep, coupon, plansMap }) => {
    const [loading, setLoading] = useState(false);
    const { method, setMethod, parameters, setParameters, canPay, setCardValidity } = usePayment(handleSubmit);
    const { createNotification } = useNotifications();
    const [check, setCheck] = useState({});
    const [plans] = usePlans();
    const [model, setModel] = useState({ cycle, currency, coupon, plansMap });
    const { call } = useEventManager();
    const { step, next, previous } = useStep(initialStep);
    const { request: requestSubscribe } = useApiWithoutResult(subscribe);
    const { request: requestCheck } = useApiWithoutResult(checkSubscription);

    const callCheck = async (m = model) => {
        try {
            setLoading(true);
            const result = await requestCheck(toParams(m, plans));
            setCheck(result);
            setLoading(false);
            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const handleChangeModel = async (newModel = {}, requireCheck = false) => {
        if (requireCheck) {
            try {
                setLoading(true);
                const result = await requestCheck(toParams(newModel, plans));
                const { Coupon, Gift } = result;
                const { Code } = Coupon || {}; // Coupon can equals null

                if (newModel.coupon !== Code) {
                    return createNotification({
                        text: c('Error').t`Your coupon is invalid or cannot be applied to your plan`,
                        type: 'error'
                    });
                }

                if (newModel.gift && !Gift) {
                    return createNotification({ text: c('Error').t`Invalid gift code`, type: 'error' });
                }

                setLoading(false);
                setCheck(result);
            } catch (error) {
                setLoading(false);
                throw error;
            }
        }

        setModel(newModel);
    };

    const handleSubmit = async () => {
        if (!canPay) {
            return;
        }

        try {
            setLoading(true);
            await requestSubscribe({ Amount: check.AmountDue, ...toParams(model, plans), ...parameters });
            await call();
            setLoading(false);
            next();
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const STEPS = [
        {
            title: c('Title').t`Customization`,
            hasCancel: true,
            hasNext: true,
            section: <CustomMailSection plans={plans} model={model} onChange={handleChangeModel} />,
            async onSubmit() {
                await callCheck();
                next();
            }
        },
        {
            title: c('Title').t`VPN protection`,
            hasPrevious: true,
            hasNext: true,
            section: <CustomVPNSection plans={plans} model={model} onChange={handleChangeModel} />,
            async onSubmit() {
                await callCheck();
                next();
            }
        },
        {
            title: c('Title').t`Order summary`,
            hasPrevious: true,
            hasNext: true,
            section: <OrderSummary plans={plans} model={model} check={check} onChange={handleChangeModel} />,
            async onSubmit() {
                if (!check.AmountDue) {
                    try {
                        setLoading(true);
                        await requestSubscribe({ Amount: check.AmountDue, ...toParams(model, plans) });
                        await call();
                        setLoading(false);
                    } catch (error) {
                        setLoading(false);
                        throw error;
                    }
                }
                next();
            }
        },
        {
            title: c('Title').t`Thank you!`,
            hasClose: true,
            section: (
                <>
                    <SubTitle>{c('Info').t`Thank you for your subscription`}</SubTitle>
                    <Paragraph>{c('Info').t`Your new features are now available`}</Paragraph>
                    <FeaturesList />
                </>
            ),
            onSubmit: onClose
        }
    ];

    if (check.AmountDue > 0) {
        STEPS.splice(4, 0, {
            title: c('Title').t`Payment details`,
            hasPrevious: true,
            hasNext: true,
            section: (
                <>
                    <Row>
                        <Label>{c('Label').t`Amount due`}</Label>
                        <Field>
                            <Price currency={model.currency}>{check.AmountDue}</Price>
                        </Field>
                    </Row>
                    ]
                    <Payment
                        type="subscription"
                        method={method}
                        amount={check.AmountDue}
                        currency={model.currency}
                        onParameters={setParameters}
                        onMethod={setMethod}
                        onValidCard={setCardValidity}
                    />
                </>
            ),
            onSubmit: handleSubmit
        });
    }

    return (
        <Modal show={true} onClose={onClose} title={STEPS[step].title}>
            <ContentModal onSubmit={STEPS[step].onSubmit} onReset={onClose} loading={loading}>
                {STEPS[step].section}
                <FooterModal>
                    {STEPS[step].hasCancel && <ResetButton>{c('Action').t`Cancel`}</ResetButton>}
                    {STEPS[step].hasPrevious && <Button onClick={previous}>{c('Action').t`Previous`}</Button>}
                    {STEPS[step].hasNext && <PrimaryButton type="submit">{c('Action').t`Next`}</PrimaryButton>}
                    {STEPS[step].hasClose && <PrimaryButton type="reset">{c('Action').t`Close`}</PrimaryButton>}
                </FooterModal>
            </ContentModal>
        </Modal>
    );
};

SubscriptionModal.propTypes = {
    onClose: PropTypes.func,
    cycle: PropTypes.number,
    coupon: PropTypes.string,
    currency: PropTypes.string,
    step: PropTypes.number,
    plansMap: PropTypes.object
};

SubscriptionModal.defaultProps = {
    step: 0,
    coupon: '',
    currency: DEFAULT_CURRENCY,
    cycle: DEFAULT_CYCLE,
    plansMap: {}
};

export default SubscriptionModal;
