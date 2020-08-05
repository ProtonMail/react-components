import React from 'react';
import { c } from 'ttag';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { APPS, isSSOMode, isStandaloneMode } from 'proton-shared/lib/constants';
import { replaceUrl } from 'proton-shared/lib/helpers/browser';
import { getAppHref } from 'proton-shared/lib/apps/helper';

import { FormModal, useConfig, Alert } from '../../index';

interface Props {
    history: History;
    [key: string]: any;
}

const DelinquentModal = ({ ...rest }: Props) => {
    const history = useHistory();
    const { APP_NAME } = useConfig();
    const title = c('Delinquent modal title').t`Overdue invoice`;

    const handleSubmit = () => {
        if (APP_NAME === APPS.PROTONVPN_SETTINGS) {
            return history.push('/payments#invoices');

        }
        if (APP_NAME === APPS.PROTONACCOUNT) {
            return history.push('/subscription#invoices');
        }

        if (APP_NAME === APPS.PROTONMAIL_SETTINGS) {
            // TODO remove this if once general settings are in proton-account
            return history.push('/subscription#invoices');
        }
        if (isSSOMode) {
            replaceUrl(getAppHref('/settings/subscription#invoices')); // TODO replace this URL once general settings are in proton-account
        }
        if (isStandaloneMode) {
            return;
        }
        replaceUrl(getAppHref('/settings/subscription#invoices')); // TODO replace this URL once general settings are in proton-account
    };

    return (
        <FormModal
            title={title}
            hasClose={false}
            close={null}
            submit={c('Action').t`View invoice`}
            onSubmit={handleSubmit}
            small
            {...rest}
        >
            <Alert type="warning">{c('Info')
                .t`Your Proton account is currently on hold. To continue using your account, please pay any overdue invoices.`}</Alert>
        </FormModal>
    );
};

export default DelinquentModal;
