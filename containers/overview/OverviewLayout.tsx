import React, { useRef, useEffect } from 'react';
import { c } from 'ttag';
import { hasMailPlus } from 'proton-shared/lib/helpers/subscription';
import { getAccountSettingsApp } from 'proton-shared/lib/apps/helper';

import { AppLink, SectionConfig } from '../../components';
import { useUser, useSubscription, useOrganization, useUserSettings } from '../../hooks';

import SummarySection from './SummarySection';
import IndexSection from './IndexSection';
import { SettingsPageTitle } from '../account';

interface Props {
    title: string;
    pages: SectionConfig[];
    children?: React.ReactNode;
    limit?: number;
}

const OverviewLayout = ({ title, pages, children, limit }: Props) => {
    const mainAreaRef = useRef<HTMLDivElement>(null);

    const [user] = useUser();
    const [userSettings] = useUserSettings();
    const [organization] = useOrganization();
    const [subscription] = useSubscription();
    const { hasPaidMail } = user;

    useEffect(() => {
        if (mainAreaRef.current) {
            mainAreaRef.current.scrollTop = 0;
        }
    }, []);

    return (
        <div className="flex flex-item-fluid on-desktop-h100 auto-tablet flex-nowrap">
            <div
                ref={mainAreaRef}
                className="relative flex-nowrap flex-item-fluid bg-global-highlight on-desktop-h100 scroll-if-needed"
            >
                <SettingsPageTitle>{title}</SettingsPageTitle>
                <div className="container-section-sticky pt0">
                    <div className="flex on-mobile-flex-column pb2">
                        <div className="flex-item-fluid">
                            {children ? (
                                <section className="overview-grid-item overview-grid-item--full bordered-container bg-white-dm tiny-shadow-container p2 mb1-5">
                                    {children}
                                </section>
                            ) : null}
                            <IndexSection pages={pages} limit={limit} />
                        </div>
                    </div>
                </div>
            </div>
            <aside className="context-bar on-desktop-h100 scroll-if-needed p2">
                <SummarySection
                    user={user}
                    userSettings={userSettings}
                    subscription={subscription}
                    organization={organization}
                />
                {subscription && hasMailPlus(subscription) ? (
                    <div className="bg-pm-blue-gradient color-white rounded text-center p1 mt2 relative">
                        <p className="mt0 mb1">
                            {c('Info')
                                .t`Upgrade to a paid plan with multi-user support to add more users to your organization.`}
                        </p>
                        <div>
                            <AppLink
                                className="button--transparent inline-block increase-click-surface"
                                to="/subscription"
                                toApp={getAccountSettingsApp()}
                            >
                                {c('Action').t`Upgrade`}
                            </AppLink>
                        </div>
                    </div>
                ) : null}
                {hasPaidMail ? null : (
                    <div className="bg-pm-blue-gradient color-white rounded text-center p1 mt2 relative">
                        <p className="mt0 mb1">
                            {c('Info')
                                .t`Upgrade to a paid plan to unlock premium features and increase your storage space.`}
                        </p>
                        <div>
                            <AppLink
                                className="button--transparent inline-block increase-click-surface"
                                to="/subscription"
                                toApp={getAccountSettingsApp()}
                            >
                                {c('Action').t`Upgrade`}
                            </AppLink>
                        </div>
                    </div>
                )}
            </aside>
        </div>
    );
};

export default OverviewLayout;
