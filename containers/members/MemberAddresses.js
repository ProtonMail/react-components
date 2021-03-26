import React from 'react';
import PropTypes from 'prop-types';
import { msgid, c } from 'ttag';
import { APPS } from 'proton-shared/lib/constants';
import { ButtonLike, AppLink, SimpleDropdown, DropdownMenu } from '../../components';

const MemberAddresses = ({ member, addresses }) => {
    const list = addresses.map(({ ID, Email }) => (
        <div key={ID} className="w100 flex flex-nowrap pl1 pr1 pt0-5 pb0-5">
            <span className="text-ellipsis" title={Email}>
                {Email}
            </span>
        </div>
    ));
    const n = list.length;
    const addressesTxt = ` ${c('Info').ngettext(msgid`address`, `addresses`, n)}`;
    const contentDropDown = (
        <>
            {n}
            <span className="no-mobile">{addressesTxt}</span>
        </>
    ); // trick for responsive and mobile display

    if (!n) {
        return <>{contentDropDown}</>;
    }

    return (
        <>
            <SimpleDropdown shape="link" color="norm" content={contentDropDown}>
                <div className="dropdown-item pt0-5 pb0-5 pl1 pr1 flex">
                    <ButtonLike
                        as={AppLink}
                        className="w100 text-center"
                        to={`/organization/${member.ID}#addresses`}
                        toApp={APPS.PROTONACCOUNT}
                        data-testid="dropdown-addresses"
                    >{c('Link').t`Manage`}</ButtonLike>
                </div>
                <DropdownMenu>{list}</DropdownMenu>
            </SimpleDropdown>
        </>
    );
};

MemberAddresses.propTypes = {
    member: PropTypes.object.isRequired,
    addresses: PropTypes.array.isRequired,
};

export default MemberAddresses;
