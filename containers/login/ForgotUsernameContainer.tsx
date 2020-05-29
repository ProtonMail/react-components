import React from 'react';
import { c } from 'ttag';
import { History } from 'history';
import { useApi, useNotifications, useLoading, ForgotUsernameForm, Icon, SupportDropdown } from 'react-components';
import { requestUsername } from 'proton-shared/lib/api/reset';

import SignLayout from '../signup/SignLayout';
import ProtonLogo from '../../components/logo/ProtonLogo';

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
        history.goBack();
    };

    return (
        <SignLayout
            title={c('Title').t`Forgot your username?`}
            left={
                <button type="button" onClick={handleBack} title={c('Action').t`Back`}>
                    <Icon name="arrow-left" />
                    <span className="sr-only">{c('Action').t`Back`}</span>
                </button>
            }
            center={<ProtonLogo />}
            right={<SupportDropdown className="link" content={c('Action').t`Need help?`} />}
        >
            <ForgotUsernameForm onSubmit={(data) => withLoading(handleSubmit(data))} loading={loading} />
        </SignLayout>
    );
};

export default ForgotUsernameContainer;
