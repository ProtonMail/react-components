import React from 'react';
import { c } from 'ttag';
import {
    SubTitle,
    Bordered,
    Row,
    Label,
    Field,
    Loader,
    Alert,
    useSubscription,
    useOrganization,
    useUser
} from 'react-components';
import { CYCLE, PLAN_SERVICES } from 'proton-shared/lib/constants';
import { hasBit } from 'proton-shared/lib/helpers/bitset';
import humanSize from 'proton-shared/lib/helpers/humanSize';

const { MAIL, VPN } = PLAN_SERVICES;
const { MONTHLY, YEARLY, TWO_YEARS } = CYCLE;

const CYCLES = {
    [MONTHLY]: c('Billing cycle').t`Monthly`,
    [YEARLY]: c('Billing cycle').t`Yearly`,
    [TWO_YEARS]: c('Billing cycle').t`2-year`
};

const PLAN_NAMES = {
    plus: 'Plus',
    professional: 'Professional',
    visionary: 'Visionary',
    vpnbasic: 'Basic',
    vpnplus: 'Plus'
};

const SubscriptionSection = () => {
    const [{ hasPaidMail, hasPaidVpn }] = useUser();
    const [{ Plans = [], Cycle, CouponCode } = {}, loadingSubscription] = useSubscription();
    const [
        {
            UsedDomains,
            MaxDomains,
            MaxSpace,
            UsedAddresses,
            MaxAddresses,
            UsedMembers,
            MaxMembers,
            UsedVPN,
            MaxVPN
        } = {},
        loadingOrganization
    ] = useOrganization();

    if (loadingSubscription || loadingOrganization) {
        return (
            <>
                <SubTitle>{c('Title').t`Subscription`}</SubTitle>
                <Loader />
            </>
        );
    }

    const mailPlan = Plans.find(({ Type, Services }) => Type === 1 && hasBit(Services, MAIL));
    const vpnPlan = Plans.find(({ Type, Services }) => Type === 1 && hasBit(Services, VPN));

    return (
        <>
            <SubTitle>{c('Title').t`Subscription`}</SubTitle>
            <Bordered>
                <Row>
                    <Label>ProtonMail plan</Label>
                    <Field>
                        <strong>{hasPaidMail ? PLAN_NAMES[mailPlan.Name] : c('Plan').t`Free`}</strong>
                        {hasPaidMail ? null : (
                            <Alert>{c('Info')
                                .t`Combine paid ProtonMail and ProtonVPN and get a 20% discount on both`}</Alert>
                        )}
                    </Field>
                </Row>
                {hasPaidMail ? (
                    <>
                        <Row>
                            <Label>{c('Label').t`Users`}</Label>
                            <Field>
                                <strong>{`${UsedMembers}/${MaxMembers}`}</strong>
                            </Field>
                        </Row>
                        <Row>
                            <Label>{c('Label').t`Email addresses`}</Label>
                            <Field>
                                <strong>{`${UsedAddresses}/${MaxAddresses}`}</strong>
                            </Field>
                        </Row>
                        <Row>
                            <Label>{c('Label').t`Storage capacity`}</Label>
                            <Field>
                                <strong>{`${humanSize(MaxSpace)}`}</strong>
                            </Field>
                        </Row>
                        <Row>
                            <Label>{c('Label').t`Custom domains`}</Label>
                            <Field>
                                <strong>{`${UsedDomains}/${MaxDomains}`}</strong>
                            </Field>
                        </Row>
                    </>
                ) : null}
                <Row>
                    <Label>ProtonVPN plan</Label>
                    <Field>
                        <strong>{hasPaidVpn ? PLAN_NAMES[vpnPlan.Name] : c('Plan').t`Free`}</strong>
                        {hasPaidMail ? null : (
                            <Alert>{c('Info')
                                .t`Combine paid ProtonMail and ProtonVPN and get a 20% discount on both`}</Alert>
                        )}
                    </Field>
                </Row>
                {hasPaidVpn ? (
                    <Row>
                        <Label>{c('Label').t`VPN connections`}</Label>
                        <Field>
                            <strong>{`${UsedVPN}/${MaxVPN}`}</strong>
                        </Field>
                    </Row>
                ) : null}
                <Row>
                    <Label>{c('Label').t`Billing cycle`}</Label>
                    <Field>
                        <strong>{CYCLES[Cycle]}</strong>
                        {Cycle === MONTHLY ? (
                            <Alert>{c('Info').t`Switch to annual billing for a 20% discount`}</Alert>
                        ) : null}
                    </Field>
                </Row>
                <Row>
                    <Label>{c('Label').t`Coupon`}</Label>
                    <Field>
                        <strong>{CouponCode ? CouponCode : c('Label').t`None`}</strong>
                    </Field>
                </Row>
            </Bordered>
        </>
    );
};

export default SubscriptionSection;
