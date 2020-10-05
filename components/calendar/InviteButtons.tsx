import { ICAL_ATTENDEE_STATUS } from 'proton-shared/lib/calendar/constants';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';
import { InviteActions } from 'proton-shared/lib/interfaces/calendar';
import { c } from 'ttag';
import React from 'react';
import { useLoadingMap } from '../../hooks';
import { SmallButton } from '../button';
import { DropdownActions } from '../dropdown';

interface Props {
    actions: InviteActions;
    partstat?: ICAL_ATTENDEE_STATUS;
    disabled?: boolean;
    className?: string;
}
const InviteButtons = ({ actions, partstat = ICAL_ATTENDEE_STATUS.NEEDS_ACTION, disabled, className = '' }: Props) => {
    const [loadingMap, withLoadingMap] = useLoadingMap();

    const { onAccept, onTentative, onDecline } = actions;
    const { accept: loadingAccept, tentative: loadingTentative, decline: loadingDecline } = loadingMap;
    const loadingAnswer = loadingAccept || loadingTentative || loadingDecline;

    if (partstat === ICAL_ATTENDEE_STATUS.NEEDS_ACTION) {
        return (
            <div className={className}>
                <SmallButton
                    onClick={onAccept}
                    disabled={loadingAnswer}
                    loading={loadingAccept}
                    className="mr0-5"
                >
                    {c('Action').t`Yes`}
                </SmallButton>
                <SmallButton
                    onClick={onTentative}
                    disabled={loadingAnswer}
                    loading={loadingTentative}
                    className="mr0-5"
                >
                    {c('Action').t`Maybe`}
                </SmallButton>
                <SmallButton onClick={onDecline} disabled={loadingAnswer} loading={loadingDecline}>
                    {c('Action').t`No`}
                </SmallButton>
            </div>
        );
    }
    const accepted = partstat === ICAL_ATTENDEE_STATUS.ACCEPTED;
    const tentative = partstat === ICAL_ATTENDEE_STATUS.TENTATIVE;
    const declined = partstat === ICAL_ATTENDEE_STATUS.DECLINED;
    const list = [
        !accepted && {
            text: c('Action').t`Yes, I'm attending`,
            onClick: () => onAccept(),
        },
        !tentative && {
            text: c('Action').t`Maybe I'm attending`,
            onClick: () => onTentative(),
        },
        !declined && {
            text: c('Action').t`No, I'm not attending`,
            actionType: 'delete',
            onClick: () => onDecline(),
        } as const,
    ].filter(isTruthy);
    return (
        <DropdownActions
            className="pm-button--small"
            key="actions"
            list={list}
            loading={loadingAnswer}
            disabled={disabled}
        />
    );
};

export default InviteButtons;
