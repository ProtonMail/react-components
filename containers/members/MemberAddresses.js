import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { msgid, c } from 'ttag';
import { Dropdown, DropdownMenu, Icon } from 'react-components';

const MemberAddresses = ({ member }) => {
    const addresses = member.addresses || [];
    const title = addresses.map(({ Email }) => Email).join(', ');
    const actions = addresses.map(({ Email: text }) => text);
    const n = actions.length;

    return (
        <>
            <Dropdown
                title={title}
                className="pm-button--link"
                content={
                    <>
                        {c('Info').ngettext(msgid`${n} address`, `${n} addresses`, n)} <Icon name="caret" />
                    </>
                }
            >
                <DropdownMenu>{actions}</DropdownMenu>
                <div className="alignright">
                    <Link className="pm-button pm-button--small" to="/settings/addresses">{c('Link').t`Manage`}</Link>
                </div>
            </Dropdown>
        </>
    );
};

MemberAddresses.propTypes = {
    member: PropTypes.object.isRequired
};

export default MemberAddresses;
