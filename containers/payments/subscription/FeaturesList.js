import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { useUser, useOrganization, Href, Icon } from 'react-components';
import { Link } from 'react-router-dom';

const FeaturesList = () => {
    const [{ hasPaidMail } = {}] = useUser();
    const [{ MaxMembers } = {}] = useOrganization();
    const features = [
        ...(hasPaidMail
            ? [
                  { to: '/settings/auto-reply', text: c('Link').t`Add auto-reply` },
                  { to: '/settings/domains', text: c('Link').t`Add custom domain` },
                  { to: '/settings/filters', text: c('Link').t`Add filters` },
                  { to: '/contacts', text: c('Link').t`Manage encrypted contacts`, internal: true }
              ]
            : []),
        ...(MaxMembers > 1 ? [{ to: '/settings/members', text: c('Link').t`Add new users` }] : []),
        { to: 'https://protonvpn.com/download/', text: c('Link').t`Use ProtonVPN`, external: true }
    ];
    return (
        <ul className="unstyled flex flex-nowrap flex-spacebetween">
            {features.map(({ to, text, external, internal }, index) => {
                const key = `${index}`;
                return (
                    <li key={key} className="mb0-5 aligncenter">
                        {external || internal ? (
                            <Href href={to} target={external ? '_blank' : '_self'}>
                                <div>
                                    <Icon name="on" />
                                </div>
                                {text}
                            </Href>
                        ) : (
                            <Link to={to}>
                                <div>
                                    <Icon name="on" />
                                </div>
                                {text}
                            </Link>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

FeaturesList.propTypes = {
    model: PropTypes.object
};

export default FeaturesList;
