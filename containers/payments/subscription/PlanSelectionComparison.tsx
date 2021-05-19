import React, { useRef } from 'react';
import { c } from 'ttag';
import { PLANS, PLAN_SERVICES } from 'proton-shared/lib/constants';
import { switchPlan } from 'proton-shared/lib/helpers/planIDs';
import { Organization, Plan, PlanIDs } from 'proton-shared/lib/interfaces';
import { Button, Icon } from '../../../components';
import MailFeatures from './MailFeatures';
import VPNFeatures from './VPNFeatures';
import CalendarFeatures from './CalendarFeatures';
import DriveFeatures from './DriveFeatures';

interface Props {
    service: PLAN_SERVICES;
    onChangePlanIDs: (newPlanIDs: PlanIDs) => void;
    plans: Plan[];
    planIDs: PlanIDs;
    planNamesMap: { [key in PLANS]: Plan };
    organization?: Organization;
}

const PlanSelectionComparison = ({ service, onChangePlanIDs, plans, planNamesMap, organization, planIDs }: Props) => {
    const featuresRef = useRef<HTMLDivElement>(null);
    return (
        <>
            <p className="text-sm">{c('Info').t`* Customizable features`}</p>
            <Button
                color="norm"
                shape="ghost"
                className="flex flex-align-items-center center mb1"
                onClick={() => {
                    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
            >
                <span className="mr0-5">{c('Action').t`Compare all features`}</span>
                <Icon name="arrow-down" className="align-sub" />
            </Button>
            <div ref={featuresRef}>
                {service === PLAN_SERVICES.MAIL ? (
                    <>
                        <MailFeatures
                            onSelect={(planName) => {
                                const plan = plans.find(({ Name }) => Name === planName);
                                onChangePlanIDs(
                                    switchPlan({
                                        planIDs,
                                        plans,
                                        planID: plan?.ID,
                                        service,
                                        organization,
                                    })
                                );
                            }}
                        />
                        <CalendarFeatures
                            onSelect={(planName) => {
                                const plan = plans.find(({ Name }) => Name === planName);
                                onChangePlanIDs(
                                    switchPlan({
                                        planIDs,
                                        plans,
                                        planID: plan?.ID,
                                        service,
                                        organization,
                                    })
                                );
                            }}
                        />
                        <DriveFeatures
                            onSelect={(planName) => {
                                const plan = plans.find(({ Name }) => Name === planName);
                                onChangePlanIDs(
                                    switchPlan({
                                        planIDs,
                                        plans,
                                        planID: plan?.ID,
                                        service,
                                        organization,
                                    })
                                );
                            }}
                        />
                        <p className="text-sm mt1 mb0-5 color-weak">
                            * {c('Info concerning plan features').t`Customizable features`}
                        </p>
                        <p className="text-sm mt0 mb1 color-weak">
                            **{' '}
                            {c('Info concerning plan features')
                                .t`ProtonMail cannot be used for mass emailing or spamming. Legitimate emails are unlimited.`}
                        </p>
                    </>
                ) : null}
                {service === PLAN_SERVICES.VPN ? (
                    <VPNFeatures
                        planNamesMap={planNamesMap}
                        onSelect={(planName) => {
                            const plan = plans.find(({ Name }) => Name === planName);
                            onChangePlanIDs(
                                switchPlan({
                                    planIDs,
                                    plans,
                                    planID: plan?.ID,
                                    service,
                                    organization,
                                })
                            );
                        }}
                    />
                ) : null}
            </div>
        </>
    );
};

export default PlanSelectionComparison;
