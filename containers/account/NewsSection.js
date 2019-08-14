import React from 'react';
import { c } from 'ttag';
import { SubTitle, Alert, useSubscription, useUser, MozillaInfoPanel } from 'react-components';
import NewsCheckboxes from './NewsCheckboxes';

const NewsSection = () => {
    const [{ isManagedByMozilla } = {}] = useSubscription();
    const [{ isMember }] = useUser();

    if (isMember) {
        return null;
    }

    if (isManagedByMozilla) {
        return (
            <>
                <SubTitle>{c('Title').t`Email subscriptions`}</SubTitle>
                <MozillaInfoPanel />
            </>
        );
    }

    return (
        <>
            <SubTitle>{c('Title').t`Email subscriptions`}</SubTitle>
            <Alert>{c('Info')
                .t`To keep up with the latest development at Proton products, you can subscribe to our various emails and visit our blog from time to time.`}</Alert>
            <NewsCheckboxes />
        </>
    );
};

export default NewsSection;
