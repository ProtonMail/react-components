import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { msgid, c } from 'ttag';
import { Button, Dropdown, DropdownMenu, Icon } from 'react-components';

const DomainAddresses = ({ domain }) => {
    const addresses = domain.addresses || [];
    const title = addresses.map(({ Email }) => Email).join(', ');
    const list = addresses.map(({ Email }) => Email);
    const n = addresses.length;

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

DomainAddresses.propTypes = {
    domain: PropTypes.object.isRequired
};

export default DomainAddresses;
