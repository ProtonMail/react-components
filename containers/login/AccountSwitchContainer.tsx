import React, { FunctionComponent } from 'react';
import { c } from 'ttag';
import { useHistory } from 'react-router-dom';

import { useApi, useLoading, LinkButton } from '../../index';
import { Props as AccountLayoutProps } from '../signup/AccountPublicLayout';

interface Props {
    Layout: FunctionComponent<AccountLayoutProps>;
}

const AccountSwitchContainer = ({ Layout }: Props) => {
    const history = useHistory();
    const api = useApi();
    const [loading, withLoading] = useLoading();

    const handleSignOutAll = async () => {
        // Clear everything
        history.push('/login');
    }

    return (
        <Layout title={c('Title').t`Choose an account`} right={<LinkButton onClick={handleSignOutAll}>{c('Action').t`Sign out all accounts`}</LinkButton>}>
        </Layout>
    );
};

export default AccountSwitchContainer;
