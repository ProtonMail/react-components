import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { c, msgid } from 'ttag';
import { SimpleDropdown, DropdownMenu } from 'react-components';

const DomainAddresses = ({ domain }) => {
    const addresses = domain.addresses || [];
    const title = addresses.map(({ Email }) => Email).join(', ');
    const list = addresses.map(({ Email }) => Email);
    const n = addresses.length;

    return (
        <>
            <SimpleDropdown
                title={title}
                className="pm-button--link"
                content={c('Info').ngettext(msgid`${n} address`, `${n} addresses`, n)}
            >
                <DropdownMenu>{list}</DropdownMenu>
                <div className="alignright">
                    <Link className="pm-button pm-button--small" to="/settings/addresses">{c('Link').t`Manage`}</Link>
                </div>
            </SimpleDropdown>
        </>
    );
};

DomainAddresses.propTypes = {
    domain: PropTypes.object.isRequired
};

export default DomainAddresses;
