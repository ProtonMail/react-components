import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { msgid, c } from 'ttag';
import { Dropdown, DropdownMenu } from 'react-components';

const MemberAddresses = ({ addresses }) => {
    const list = addresses.map(({ Email }) => Email);
    const title = list.join(', ');
    const n = list.length;

    return (
        <>
            <Dropdown
                caret
                title={title}
                className="pm-button pm-button--link"
                content={c('Info').ngettext(msgid`${n} address`, `${n} addresses`, n)}
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
    addresses: PropTypes.array.isRequired
};

export default MemberAddresses;
