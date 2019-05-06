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
    PrimaryButton,
    Paragraph,
    useStep,
    useApiWithoutResult,
    useEventManager,
    SubTitle
} from 'react-components';
import { DEFAULT_CURRENCY, DEFAULT_CYCLE } from 'proton-shared/lib/constants';
import { checkSubscription } from 'proton-shared/lib/api/payments';

import CustomMailSection from './CustomMailSection';
import CustomVPNSection from './CustomVPNSection';
import OrderSummary from './OrderSummary';

const convert = ({ plansMap, cycle, plans }) => {
    return Object.entries(plansMap).reduce((acc, [planName, quantity]) => {
        if (quantity) {
            const { ID } = plans.find(({ Cycle, Name }) => Name === planName && Cycle === cycle);
            acc[ID] = quantity;
        }

        return acc;
    }, Object.create(null));
};

const SubscriptionModal = ({ onClose, cycle, currency, step: initialStep, coupon, plansMap }) => {
    const [loading] = useState();
    const [plans] = usePlans();
    const [model, setModel] = useState({ cycle, currency, coupon, plansMap });
    const { request: requestCheckSubscription } = useApiWithoutResult(
        (
            params = {
                PlanIDs: convert({ ...model, plans }),
                CouponCode: model.coupon,
                Currency: model.currency,
                Cycle: model.cycle
            }
        ) => checkSubscription(params)
    );
    const { call } = useEventManager();
    const { step, next, previous } = useStep(initialStep);

    const handleChangeModel = async (newModel = {}, requireCheck = false) => {
        if (requireCheck) {
            await requestCheckSubscription(newModel);
        }
        setModel(newModel);
    };

    const STEPS = [
        {
            title: c('Title').t`Customization`,
            section: <CustomMailSection plans={plans} model={model} onChange={handleChangeModel} />,
            async onSubmit() {
                await requestCheckSubscription();
                next();
            }
        },
        {
            title: c('Title').t`VPN protection`,
            section: <CustomVPNSection plans={plans} model={model} onChange={handleChangeModel} />,
            async onSubmit() {
                await requestCheckSubscription();
                next();
            }
        },
        {
            title: c('Title').t`Order summary`,
            section: <OrderSummary model={model} onChange={handleChangeModel} />,
            onSubmit: next
        },
        {
            title: c('Title').t`Payment details`,
            section: <></>,
            async onSubmit() {
                await call();
                next();
            }
        },
        {
            title: c('Title').t`Thank you!`,
            section: (
                <>
                    <SubTitle>{c('Info').t`Thank you for your subscription`}</SubTitle>
                    <Paragraph>{c('Info').t`Your new features are now available`}</Paragraph>
                    <ul>
                        <li />
                    </ul>
                </>
            ),
            onSubmit() {
                next();
            }
        }
    ];

    return (
        <Modal show={true} onClose={onClose} title={STEPS[step].title}>
            <ContentModal onSubmit={STEPS[step].onSubmit} onReset={onClose} loading={loading}>
                {STEPS[step].section}
                <FooterModal>
                    {step === 0 ? (
                        <ResetButton>{c('Action').t`Cancel`}</ResetButton>
                    ) : (
                        <Button onClick={previous}>{c('Action').t`Previous`}</Button>
                    )}
                    {step < STEPS.length - 1 ? (
                        <PrimaryButton type="submit">{c('Action').t`Next`}</PrimaryButton>
                    ) : (
                        <PrimaryButton type="reset">{c('Action').t`Close`}</PrimaryButton>
                    )}
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
