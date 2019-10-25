import React, { useEffect, useState, useRef } from 'react';
import differenceInDays from 'date-fns/difference_in_days';
import PropTypes from 'prop-types';
import { useUser, useApi, useLoading, useBlackFriday, TopNavbarLink } from 'react-components';
import { getLastCancelledSubscription } from 'proton-shared/lib/api/payments';

const ONE_MONTH = 30;

const BlackFridayNavbarLink = ({ to }) => {
    const api = useApi();
    const [loading, withLoading] = useLoading();
    const [user] = useUser();
    const isBlackFriday = useBlackFriday();
    const [isEligible, setEligibility] = useState(false);
    const checked = useRef(false);

    const check = async () => {
        // Return the latest subscription cancellation time, return null if the user never had any subscription, 0 if the user currently has an active subscription
        const { LastSubscriptionEnd = 0 } = await api(getLastCancelledSubscription());
        const now = new Date();

        setEligibility(LastSubscriptionEnd ? differenceInDays(now, new Date(LastSubscriptionEnd)) >= ONE_MONTH : false);
    };

    useEffect(() => {
        if (!checked.current && user.isFree && isBlackFriday) {
            withLoading(check());
            checked.current = true;
        }
    }, [isBlackFriday]);

    if (!isBlackFriday || !isEligible || user.isPaid || loading) {
        return null;
    }

    return <TopNavbarLink to={to} icon="blackfriday" text="Black Friday" />;
};

BlackFridayNavbarLink.propTypes = {
    to: PropTypes.string.isRequired
};

export default BlackFridayNavbarLink;
