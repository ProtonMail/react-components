import React from 'react';
import { c } from 'ttag';
import {
    SubTitle,
    Bordered,
    Row,
    Label,
    SmallButton,
    Loader,
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
    const { Name: mailPlanName } = mailPlan || {};
    const bundleEligible = (['plus', 'professional'].includes(mailPlanName) && !vpnPlan) || (vpnPlan && !mailPlan);
    const handleRemoveCoupon = () => {}; // TODO
    const handleChangePlan = () => {}; // TODO
    const handleModal = (action) => {
        switch (action) {
            case 'upgrade':
            case '':
        }
    };

    return (
        <>
            <SubTitle>{c('Title').t`Subscription`}</SubTitle>
            <Bordered>
                <Row>
                    <Label>ProtonMail plan</Label>
                    <div className="flex-autogrid onmobile-flex-column w100">
                        <div className="flex-autogrid-item">
                            <strong>{hasPaidMail ? PLAN_NAMES[mailPlanName] : c('Plan').t`Free`}</strong>
                        </div>
                        <div className="flex-autogrid-item">
                            {bundleEligible &&
                                c('Info').t`Combine paid ProtonMail and ProtonVPN and get a 20% discount on both`}
                        </div>
                        <div className="flex-autogrid-item alignright">
                            {hasPaidMail ? (
                                <SmallButton onClick={handleChangePlan}>{c('Action').t`Change plan`}</SmallButton>
                            ) : (
                                <SmallButton className="pm-button--primary" onClick={handleModal('upgrade')}>{c(
                                    'Action'
                                ).t`Upgrade`}</SmallButton>
                            )}
                        </div>
                    </div>
                </Row>
                {hasPaidMail ? (
                    <>
                        <Row>
                            <Label className="pl1">{c('Label').t`Users`}</Label>
                            <div className="flex-autogrid onmobile-flex-column w100">
                                <div className="flex-autogrid-item">
                                    <strong>{`${UsedMembers}/${MaxMembers}`}</strong>
                                </div>
                                <div className="flex-autogrid-item">
                                    <Progress value={(UsedMembers * 100) / MaxMembers} />
                                </div>
                                <div className="flex-autogrid-item alignright">
                                    <SmallButton onClick={handleModal}>{c('Action').t`Manage`}</SmallButton>
                                </div>
                            </div>
                        </Row>
                        <Row>
                            <Label className="pl1">{c('Label').t`Email addresses`}</Label>
                            <div className="flex-autogrid onmobile-flex-column w100">
                                <div className="flex-autogrid-item">
                                    <strong>{`${UsedAddresses}/${MaxAddresses}`}</strong>
                                </div>
                                <div className="flex-autogrid-item">
                                    <Progress value={(UsedAddresses * 100) / MaxAddresses} />
                                </div>
                                <div className="flex-autogrid-item alignright">
                                    <SmallButton onClick={handleModal}>{c('Action').t`Manage`}</SmallButton>
                                </div>
                            </div>
                        </Row>
                        <Row>
                            <Label className="pl1">{c('Label').t`Storage capacity`}</Label>
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
                                <div className="flex-autogrid-item alignright">
                                    <SmallButton onClick={handleModal}>{c('Action').t`Manage`}</SmallButton>
                                </div>
                            </div>
                        </Row>
                        <Row>
                            <Label className="pl1">{c('Label').t`Custom domains`}</Label>
                            <div className="flex-autogrid onmobile-flex-column w100">
                                <div className="flex-autogrid-item">
                                    <strong className="mr1">{`${UsedDomains}/${MaxDomains}`}</strong>
                                </div>
                                <div className="flex-autogrid-item">
                                    <Progress value={(UsedDomains * 100) / MaxDomains} />
                                </div>
                                <div className="flex-autogrid-item alignright">
                                    <SmallButton onClick={handleModal}>{c('Action').t`Manage`}</SmallButton>
                                </div>
                            </div>
                        </Row>
                        {mailPlanName === 'visionary' ? (
                            <Row>
                                <Label className="pl1">{c('Label').t`VPN connections`}</Label>
                                <div className="flex-autogrid onmobile-flex-column w100">
                                    <div className="flex-autogrid-item">
                                        <strong>{`${UsedVPN}/${MaxVPN}`}</strong>
                                    </div>
                                    <div className="flex-autogrid-item">
                                        <Progress value={(UsedVPN * 100) / MaxVPN} />
                                    </div>
                                    <div className="flex-autogrid-item alignright">
                                        <SmallButton onClick={handleModal}>{c('Action').t`Manage`}</SmallButton>
                                    </div>
                                </div>
                            </Row>
                        ) : null}
                    </>
                ) : null}
                {mailPlanName === 'visionary' ? null : (
                    <Row>
                        <Label>ProtonVPN plan</Label>
                        <div className="flex-autogrid onmobile-flex-column w100">
                            <div className="flex-autogrid-item">
                                <strong>{hasPaidVpn ? PLAN_NAMES[vpnPlan.Name] : c('Plan').t`Free`}</strong>
                            </div>
                            <div className="flex-autogrid-item">
                                {bundleEligible &&
                                    c('Info').t`Combine paid ProtonMail and ProtonVPN and get a 20% discount on both`}
                            </div>
                            <div className="flex-autogrid-item alignright">
                                {hasPaidVpn ? null : (
                                    <SmallButton className="pm-button--primary" onClick={handleModal}>{c('Action')
                                        .t`Upgrade`}</SmallButton>
                                )}
                            </div>
                        </div>
                    </Row>
                )}
                {hasPaidVpn ? (
                    <Row>
                        <Label className="pl1">{c('Label').t`VPN connections`}</Label>
                        <div className="flex-autogrid-item">
                            <strong>{`${UsedVPN}/${MaxVPN}`}</strong>
                        </div>
                        <div className="flex-autogrid-item">
                            <Progress value={(UsedVPN * 100) / MaxVPN} />
                        </div>
                        <div className="flex-autogrid-item alignright">
                            <SmallButton onClick={handleModal}>{c('Action').t`Manage`}</SmallButton>
                        </div>
                    </Row>
                ) : null}
                <Row>
                    <Label>{c('Label').t`Billing cycle`}</Label>
                    <div className="flex-autogrid onmobile-flex-column w100">
                        <div className="flex-autogrid-item">
                            <strong>{CYCLES[Cycle]}</strong>
                        </div>
                        {Cycle === MONTHLY && (
                            <div className="flex-autogrid-item">{c('Info')
                                .t`Switch to annual billing for a 20% discount`}</div>
                        )}
                        {Cycle === YEARLY && (
                            <div className="flex-autogrid-item color-global-success">{c('Info')
                                .t`20% rebate applied to your subscription`}</div>
                        )}
                        {Cycle === TWO_YEARS && (
                            <div className="flex-autogrid-item color-global-success">{c('Info')
                                .t`33% rebate applied to your subscription`}</div>
                        )}
                        {Cycle === MONTHLY && (
                            <div className="flex-autogrid-item alignright">
                                <SmallButton className="pm-button--primary" onClick={handleModal('yearly')}>{c('Action')
                                    .t`Pay yearly`}</SmallButton>
                            </div>
                        )}
                    </div>
                </Row>
                <Row>
                    <Label>{c('Label').t`Coupon`}</Label>
                    <div className="flex-autogrid onmobile-flex-column w100">
                        <div className="flex-autogrid-item">
                            <strong>{CouponCode ? CouponCode : c('Label').t`None`}</strong>
                        </div>
                        <div className="flex-autogrid-item color-global-success">
                            {CouponCode === 'BUNDLE' && c('Info').t`20% discount applied to your subscription`}
                        </div>
                        <div className="flex-autogrid-item">
                            {CouponCode && (
                                <SmallButton onClick={handleRemoveCoupon}>{c('Action').t`Remove coupon`}</SmallButton>
                            )}
                        </div>
                    </div>
                </Row>
            </Bordered>
        </>
    );
};

export default SubscriptionSection;
