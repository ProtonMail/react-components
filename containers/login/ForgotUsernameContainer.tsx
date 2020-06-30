import React, { FunctionComponent } from 'react';
import { c } from 'ttag';
import { History } from 'history';
import { requestUsername } from 'proton-shared/lib/api/reset';

import { useApi, useNotifications, useLoading, ForgotUsernameForm } from '../../index';
import { Props as SignLayoutProps } from '../signup/SignLayout';
import BackButton from '../signup/BackButton';

interface Props {
    history: History;
    WrapSignLayout: FunctionComponent<SignLayoutProps>;
}

const ForgotUsernameContainer = ({ history, WrapSignLayout }: Props) => {
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

    const handleBack = () => {
        history.push('/login');
    };

    return (
        <WrapSignLayout title={c('Title').t`Find email or username`} left={<BackButton onClick={handleBack} />}>
            <ForgotUsernameForm onSubmit={(data) => withLoading(handleSubmit(data))} loading={loading} />
        </WrapSignLayout>
    );
};

export default ForgotUsernameContainer;
