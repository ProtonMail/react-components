import React from 'react';
import PropTypes from 'prop-types';
import { useSubscription, Href } from 'react-components';

import { formatPlans } from '../../containers/payments/subscription/helpers';
import { APPS } from 'proton-shared/lib/constants';

import MailLogo from './MailLogo';

const {
    PROTONMAIL: mail,
    PROTONCONTACTS: contacts,
    PROTONDRIVE: drive,
    PROTONCALENDAR: calendar,
    PROTONVPN_SETTINGS: vpn,
    PROTONMAIL_SETTINGS: mailSettings
} = APPS;

const MainLogo = ({ currentApp, url = 'https://mail.protonmail.com/' }) => {
    const [{ Plans } = {}] = useSubscription();

    const { mailPlan = {}, vpnPlan = {} } = formatPlans(Plans);

    let logo = null;
    switch (currentApp) {
        case mail:
            logo = <MailLogo planName={mailPlan.Name} />;
            break;
        case mailSettings:
            logo = <MailLogo planName={mailPlan.Name} />;
            break;
        // we do not have the proper logos for all the products yet. Use mail logo in the meantime
        case contacts:
            logo = <MailLogo planName={mailPlan.Name} />;
            break;
        case drive:
            logo = <MailLogo planName={mailPlan.Name} />;
            break;
        case calendar:
            logo = <MailLogo planName={mailPlan.Name} />;
            break;
        case vpn:
            logo = <MailLogo planName={vpnPlan.Name} />;
            break;
    }

    return (
        <Href url={url} rel="noreferrer help" className="logo-container nodecoration flex-item-centered-vert">
            {logo}
        </Href>
    );
};

MainLogo.propTypes = {
    currentApp: PropTypes.oneOf([mail, mailSettings, contacts, calendar, drive, vpn]).isRequired,
    url: PropTypes.string
};

export default MainLogo;
