import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { msgid, c } from 'ttag';
import { Dropdown, DropdownMenu, Button, Icon } from 'react-components';

const MemberAddresses = ({ member }) => {
    const addresses = member.addresses || [];
    const title = addresses.map(({ Email }) => Email).join(', ');
    const list = addresses.map(({ Email }) => Email);
    const n = list.length;

    return (
        <>
            <Dropdown
                title={title}
                button={
                    <Button className="pagination-expand-button pm-button--link">
                        {c('Info').ngettext(msgid`${n} address`, `${n} addresses`, n)}{' '}
                        <Icon className="pagination-expand-caret" size={12} name="caret" />
                    </Button>
                }
            >
                <DropdownMenu>{list}</DropdownMenu>
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
