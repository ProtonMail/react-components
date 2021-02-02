import React, { ReactNode, useRef, useMemo } from 'react';
import { c } from 'ttag';

import humanSize from 'proton-shared/lib/helpers/humanSize';
import { hasMailProfessional, hasVisionary } from 'proton-shared/lib/helpers/subscription';
import { getAccountSettingsApp } from 'proton-shared/lib/apps/helper';
import { AppLink, Meter } from '..';
import { useUser, useSubscription } from '../../hooks';
import Hamburger from './Hamburger';
import MobileAppsLinks from './MobileAppsLinks';
import { useFocusTrap } from '../focus';

interface Props {
    logo?: React.ReactNode;
    expanded?: boolean;
    onToggleExpand?: () => void;
    primary?: ReactNode;
    children?: ReactNode;
    version?: ReactNode;
    hasAppLinks?: boolean;
}

const Sidebar = ({ expanded = false, onToggleExpand, hasAppLinks = true, logo, primary, children, version }: Props) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const focusTrapProps = useFocusTrap({
        active: expanded,
        rootRef,
    });
    const [user] = useUser();
    const [subscription] = useSubscription();
    const { UsedSpace, MaxSpace, isMember, isSubUser } = user;
    const spacePercentage = Math.round((UsedSpace * 100) / MaxSpace);

    const canAddStorage = useMemo(() => {
        if (!subscription) {
            return false;
        }
        if (isSubUser) {
            return false;
        }
        if (isMember) {
            return false;
        }
        if (hasVisionary(subscription) || hasMailProfessional(subscription)) {
            return false;
        }
        return true;
    }, [subscription, user]);

    return (
        <div
            ref={rootRef}
            className="sidebar flex flex-nowrap flex-column no-print no-outline"
            data-expanded={expanded}
            {...focusTrapProps}
        >
            <div className="no-desktop no-tablet flex-item-noshrink">
                <div className="flex flex-justify-space-between flex-align-items-center pl1 pr1">
                    {logo}
                    <Hamburger expanded={expanded} onToggle={onToggleExpand} data-focus-fallback={1} />
                </div>
            </div>
            {primary ? <div className="pl1 pr1 pb1 flex-item-noshrink">{primary}</div> : null}
            <div className="on-mobile-mt1" aria-hidden="true" />
            <div className="flex-item-fluid flex-nowrap flex flex-column scroll-if-needed customScrollBar-container pb1">
                {children}
            </div>
            <div className="flex flex-column flex-items-center">
                <span className="smaller aligncenter mt0 mb0-5">
                    {humanSize(UsedSpace)}&nbsp;/&nbsp;{humanSize(MaxSpace)}
                </span>
                <Meter className="is-thin bl mb0-5 w70" value={spacePercentage} />
                {canAddStorage ? (
                    <AppLink
                        to="/subscription"
                        toApp={getAccountSettingsApp()}
                        className="small link mb0-5 mt0"
                        title={c('Apps dropdown').t`Add storage space`}
                    >
                        {c('Action').t`Add storage`}
                    </AppLink>
                ) : null}
            </div>
            {version}
            {hasAppLinks ? <MobileAppsLinks /> : null}
        </div>
    );
};

export default Sidebar;
