import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useUser, useApi, useLoading, useBlackFriday, TopNavbarLink } from 'react-components';
import { checkLastCancelledSubscription } from './helpers';

const BlackFridayNavbarLink = ({ to }) => {
    const api = useApi();
    const [loading, withLoading] = useLoading();
    const [user] = useUser();
    const isBlackFriday = useBlackFriday();
    const [isEligible, setEligibility] = useState(false);
    const checked = useRef(false);

    useEffect(() => {
        if (!checked.current && user.isFree && isBlackFriday) {
            withLoading(checkLastCancelledSubscription(api).then(setEligibility));
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
