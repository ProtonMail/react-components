import React from 'react';
import { c } from 'ttag';
import { History } from 'history';
import { useApi, useNotifications, useLoading, ForgotUsernameForm } from 'react-components';
import { requestUsername } from 'proton-shared/lib/api/reset';

import SignInLayout from './SignInLayout';

interface Props {
    history: History;
}

const ForgotUsernameContainer = ({ history }: Props) => {
    const api = useApi();
    const [loading, withLoading] = useLoading();
    const { createNotification } = useNotifications();

    const handleSubmit = async (email: string) => {
        await api(requestUsername(email));
        createNotification({
            text: c('Success')
                .t`If you entered a valid notification email we will send you an email with your usernames in the next minute.`
        });
        history.push('/login');
    };

    return (
        <SignInLayout title={c('Title').t`Forgot your username?`}>
            <ForgotUsernameForm onSubmit={(data) => withLoading(handleSubmit(data))} loading={loading} />
        </SignInLayout>
    );
};

export default ForgotUsernameContainer;
