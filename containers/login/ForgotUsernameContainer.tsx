import React from 'react';
import { c } from 'ttag';
import { History } from 'history';
import { requestUsername } from 'proton-shared/lib/api/reset';

import { useApi, useNotifications, useLoading, ForgotUsernameForm, SupportDropdown } from '../../index';
import SignLayout from '../signup/SignLayout';
import ProtonLogo from '../../components/logo/ProtonLogo';
import BackButton from '../signup/BackButton';

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

    const handleBack = () => {
        history.push('/login');
    };

    return (
        <SignLayout
            title={c('Title').t`Forgot your username?`}
            left={<BackButton onClick={handleBack} />}
            center={<ProtonLogo />}
            right={
                <SupportDropdown noCaret={true} className="link">
                    {c('Action').t`Need help?`}
                </SupportDropdown>
            }
        >
            <ForgotUsernameForm onSubmit={(data) => withLoading(handleSubmit(data))} loading={loading} />
        </SignLayout>
    );
};

export default ForgotUsernameContainer;
