import React from 'react';
import { c } from 'ttag';
import {
    SubTitle,
    Bordered,
    Row,
    Label,
    Field,
    SmallButton,
    Loader,
    Alert,
    Progress,
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
            UsedSpace,
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
    const handleRemoveCoupon = () => {}; // TODO
    const handleModal = () => {}; // TODO

    return (
        <>
            <SubTitle>{c('Title').t`Subscription`}</SubTitle>
            <Bordered>
                <Row>
                    <Label>ProtonMail plan</Label>
                    <Field>
                        <strong>{hasPaidMail ? PLAN_NAMES[mailPlan.Name] : c('Plan').t`Free`}</strong>
                        {hasPaidMail ? null : (
                            <>
                                <Alert>{c('Info')
                                    .t`Combine paid ProtonMail and ProtonVPN and get a 20% discount on both`}</Alert>
                                <SmallButton className="pm-button--primary" onClick={handleModal}>{c('Action')
                                    .t`Upgrade`}</SmallButton>
                            </>
                        )}
                    </Field>
                </Row>
                {hasPaidMail ? (
                    <>
                        <Row>
                            <Label>{c('Label').t`Users`}</Label>
                            <div className="flex-autogrid onmobile-flex-column w100">
                                <div className="flex-autogrid-item">
                                    <strong>{`${UsedMembers}/${MaxMembers}`}</strong>
                                </div>
                                <div className="flex-autogrid-item">
                                    <Progress value={(UsedMembers * 100) / MaxMembers} />
                                </div>
                                <div className="flex-autogrid-item">
                                    <SmallButton onClick={handleModal}>{c('Action').t`Manage`}</SmallButton>
                                </div>
                            </div>
                        </Row>
                        <Row>
                            <Label>{c('Label').t`Email addresses`}</Label>
                            <div className="flex-autogrid onmobile-flex-column w100">
                                <div className="flex-autogrid-item">
                                    <strong>{`${UsedAddresses}/${MaxAddresses}`}</strong>
                                </div>
                                <div className="flex-autogrid-item">
                                    <Progress value={(UsedAddresses * 100) / MaxAddresses} />
                                </div>
                                <div className="flex-autogrid-item">
                                    <SmallButton onClick={handleModal}>{c('Action').t`Manage`}</SmallButton>
                                </div>
                            </div>
                        </Row>
                        <Row>
                            <Label>{c('Label').t`Storage capacity`}</Label>
                            <div className="flex-autogrid onmobile-flex-column w100">
                                <div className="flex-autogrid-item">
                                    <strong>{`${humanSize(UsedSpace, 'GB', true)}/${humanSize(
                                        MaxSpace,
                                        'GB'
                                    )}`}</strong>
                                </div>
                                <div className="flex-autogrid-item">
                                    <Progress value={(UsedSpace * 100) / MaxSpace} />
                                </div>
                                <div className="flex-autogrid-item">
                                    <SmallButton onClick={handleModal}>{c('Action').t`Manage`}</SmallButton>
                                </div>
                            </div>
                        </Row>
                        <Row>
                            <Label>{c('Label').t`Custom domains`}</Label>
                            <div className="flex-autogrid onmobile-flex-column w100">
                                <div className="flex-autogrid-item">
                                    <strong className="mr1">{`${UsedDomains}/${MaxDomains}`}</strong>
                                </div>
                                <div className="flex-autogrid-item">
                                    <Progress value={(UsedDomains * 100) / MaxDomains} />
                                </div>
                                <div className="flex-autogrid-item">
                                    <SmallButton onClick={handleModal}>{c('Action').t`Manage`}</SmallButton>
                                </div>
                            </div>
                        </Row>
                    </>
                ) : null}
                <Row>
                    <Label>ProtonVPN plan</Label>
                    <Field>
                        <strong>{hasPaidVpn ? PLAN_NAMES[vpnPlan.Name] : c('Plan').t`Free`}</strong>
                        {hasPaidMail ? null : (
                            <>
                                <Alert>{c('Info')
                                    .t`Combine paid ProtonMail and ProtonVPN and get a 20% discount on both`}</Alert>
                                <SmallButton className="pm-button--primary" onClick={handleModal}>{c('Action')
                                    .t`Upgrade`}</SmallButton>
                            </>
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
                        {Cycle === MONTHLY && <Alert>{c('Info').t`Switch to annual billing for a 20% discount`}</Alert>}
                        {Cycle === YEARLY && <Alert>{c('Info').t`20% rebate applied to your subscription`}</Alert>}
                        {Cycle === TWO_YEARS && <Alert>{c('Info').t`33% rebate applied to your subscription`}</Alert>}
                        {Cycle === MONTHLY && (
                            <SmallButton onClick={handleModal('yearly')}>{c('Action').t`Pay yearly`}</SmallButton>
                        )}
                    </Field>
                </Row>
                <Row>
                    <Label>{c('Label').t`Coupon`}</Label>
                    <Field>
                        <strong>{CouponCode ? CouponCode : c('Label').t`None`}</strong>
                        {CouponCode === 'BUNDLE' && (
                            <Alert>{c('Info').t`20% discount applied to your subscription`}</Alert>
                        )}
                        {CouponCode && (
                            <SmallButton onClick={handleRemoveCoupon}>{c('Action').t`Remove coupon`}</SmallButton>
                        )}
                    </Field>
                </Row>
            </Bordered>
        </>
    );
};

export default SubscriptionSection;
