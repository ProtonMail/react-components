import React from 'react';
import PropTypes from 'prop-types';
import { usePlans, Loader } from 'react-components';
import { toMap } from 'proton-shared/lib/helpers/object';
import { PLANS } from 'proton-shared/lib/constants';
import { c } from 'ttag';

import SubscriptionPrices from './SubscriptionPrices';

const MailFeaturesTable = ({ cycle, currency }) => {
    const [plans, loadingPlans] = usePlans();
    const plansMap = toMap(plans, 'Name');

    if (loadingPlans) {
        return <Loader />;
    }

    return (
        <>
            <table className="pm-simple-table pm-simple-table--alternate-bg-row pm-simple-table--bordered w100">
                <thead>
                    <tr>
                        <th scope="col" className="aligncenter aligntop pm-simple-table-row-th pt1">
                            <span className="uppercase">Free</span>
                            <div><SubscriptionPrices cycle={cycle} currency={currency} /></div>
                        </th>
                        <th scope="col" className="aligncenter aligntop pm-simple-table-row-th pt1">
                            <div className="uppercase">Plus</div>
                            <SubscriptionPrices cycle={cycle} currency={currency} plan={plansMap[PLANS.PLUS]} />
                        </th>
                        <th scope="col" className="aligncenter aligntop pm-simple-table-row-th pt1">
                            <div className="uppercase">Professional</div>
                            <SubscriptionPrices cycle={cycle} currency={currency} plan={plansMap[PLANS.PROFESSIONAL]} />
                        </th>
                        <th scope="col" className="aligncenter aligntop pm-simple-table-row-th pt1">
                            <div className="uppercase">Visionary</div>
                            <SubscriptionPrices cycle={cycle} currency={currency} plan={plansMap[PLANS.VISIONARY]} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{c('Feature').t`1 user`}</td>
                        <td>{c('Feature').t`1 user`}</td>
                        <td>{c('Feature').t`1 - 5000 users *`}</td>
                        <td>{c('Feature').t`6 users`}</td>
                    </tr>
                    <tr>
                        <td>{c('Feature').t`0.5 GB storage`}</td>
                        <td>{c('Feature').t`5 GB storage *`}</td>
                        <td>{c('Feature').t`5 GB storage / user *`}</td>
                        <td>{c('Feature').t`20 GB storage`}</td>
                    </tr>
                    <tr>
                        <td>{c('Feature').t`1 address`}</td>
                        <td>{c('Feature').t`5 addresses *`}</td>
                        <td>{c('Feature').t`5 addresses / user *`}</td>
                        <td>{c('Feature').t`50 addresses`}</td>
                    </tr>
                    <tr>
                        <td>{c('Feature').t`No domain support`}</td>
                        <td>{c('Feature').t`1 custom domain *`}</td>
                        <td>{c('Feature').t`2 custom domains *`}</td>
                        <td>{c('Feature').t`10 custom domains`}</td>
                    </tr>
                    <tr>
                        <td>{c('Feature').t`150 messages per day`}</td>
                        <td>{c('Feature').t`Unlimited messages **`}</td>
                        <td>{c('Feature').t`Unlimited messages **`}</td>
                        <td>{c('Feature').t`Unlimited messages **`}</td>
                    </tr>
                    <tr>
                        <td>{c('Feature').t`3 folders / labels`}</td>
                        <td>{c('Feature').t`200 folders / labels`}</td>
                        <td>{c('Feature').t`Unlimited folders / labels`}</td>
                        <td>{c('Feature').t`Unlimited folders / labels`}</td>
                    </tr>
                    <tr>
                        <td>{c('Feature').t`Limited support`}</td>
                        <td>{c('Feature').t`Priority support`}</td>
                        <td>{c('Feature').t`Priority support`}</td>
                        <td>{c('Feature').t`Priority support`}</td>
                    </tr>
                    <tr>
                        <td>
                            <del>{c('Feature').t`Encrypted contacts`}</del>
                        </td>
                        <td>{c('Feature').t`Encrypted contacts`}</td>
                        <td>{c('Feature').t`Encrypted contacts`}</td>
                        <td>{c('Feature').t`Encrypted contacts`}</td>
                    </tr>
                    <tr>
                        <td>
                            <del>{c('Feature').t`Address verification`}</del>
                        </td>
                        <td>{c('Feature').t`Address verification`}</td>
                        <td>{c('Feature').t`Address verification`}</td>
                        <td>{c('Feature').t`Address verification`}</td>
                    </tr>
                    <tr>
                        <td>
                            <del>{c('Feature').t`Custom filters`}</del>
                        </td>
                        <td>{c('Feature').t`Custom filters`}</td>
                        <td>{c('Feature').t`Custom filters`}</td>
                        <td>{c('Feature').t`Custom filters`}</td>
                    </tr>
                    <tr>
                        <td>
                            <del>{c('Feature').t`IMAP/SMTP support`}</del>
                        </td>
                        <td>{c('Feature').t`IMAP/SMTP support`}</td>
                        <td>{c('Feature').t`IMAP/SMTP support`}</td>
                        <td>{c('Feature').t`IMAP/SMTP support`}</td>
                    </tr>
                    <tr>
                        <td>
                            <del>{c('Feature').t`Autoresponder`}</del>
                        </td>
                        <td>{c('Feature').t`Autoresponder`}</td>
                        <td>{c('Feature').t`Autoresponder`}</td>
                        <td>{c('Feature').t`Autoresponder`}</td>
                    </tr>
                    <tr>
                        <td>
                            <del>{c('Feature').t`@pm.me short domain`}</del>
                        </td>
                        <td>{c('Feature').t`@pm.me short domain`}</td>
                        <td>{c('Feature').t`@pm.me short domain`}</td>
                        <td>{c('Feature').t`@pm.me short domain`}</td>
                    </tr>
                    <tr>
                        <td>
                            <del>{c('Feature').t`Catch all email`}</del>
                        </td>
                        <td>
                            <del>{c('Feature').t`Catch all email`}</del>
                        </td>
                        <td>{c('Feature').t`Catch all email`}</td>
                        <td>{c('Feature').t`Catch all email`}</td>
                    </tr>
                    <tr>
                        <td>
                            <del>{c('Feature').t`Multi user support`}</del>
                        </td>
                        <td>
                            <del>{c('Feature').t`Multi user support`}</del>
                        </td>
                        <td>{c('Feature').t`Multi user support`}</td>
                        <td>{c('Feature').t`Multi user support`}</td>
                    </tr>
                    <tr>
                        <td>
                            <del>{c('Feature').t`ProtonVPN included`}</del>
                        </td>
                        <td>
                            <del>{c('Feature').t`ProtonVPN included`}</del>
                        </td>
                        <td>
                            <del>{c('Feature').t`ProtonVPN included`}</del>
                        </td>
                        <td>{c('Feature').t`ProtonVPN included`}</td>
                    </tr>
                </tbody>
            </table>
            <p className="small mt1 mb0">* {c('Info concerning plan features').t`Denotes customizable features`}</p>
            <p className="small mt1 mb0">
                **{' '}
                {c('Info concerning plan features')
                    .t`ProtonMail cannot be used for mass emailing or spamming. Legitimate emails are unlimited.`}
            </p>
        </>
    );
};

MailFeaturesTable.propTypes = {
    cycle: PropTypes.number,
    currency: PropTypes.string
};

export default MailFeaturesTable;
