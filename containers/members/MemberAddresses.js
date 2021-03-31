import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { msgid, c } from 'ttag';
import { Icon } from '../../components';
import { classnames } from '../../helpers';

const amountOfDisplayedAddresses = 3;

const MemberAddresses = ({ addresses }) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(true);
    };

    const amountOfAddresses = addresses.length;

    const addressesPluralized = `${c('Info').ngettext(msgid`address`, `addresses`, amountOfAddresses)}`;

    const renderListItem = ({ ID, Email }, index) => {
        /*
         * By default, the addresses list shows 3 addresses as well as
         * a clickable text saying "x more addresses", which, when clicked,
         * expands the addresses list and shows all addresses.
         *
         * While not expanded the last list-item is colored more lightly as
         * if to indicate a fade.
         */
        const isLastDisplayedAddress = index === amountOfDisplayedAddresses - 1;

        const displayAsFade = !expanded && isLastDisplayedAddress && amountOfAddresses > amountOfDisplayedAddresses;

        const listItemClassName = classnames([displayAsFade && 'color-weak', 'mt0-5 mb0-5']);

        return (
            <li key={ID} className={listItemClassName}>
                <span className="text-ellipsis" title={Email}>
                    {Email}
                </span>
            </li>
        );
    };

    const initiallyDisplayedAddresses = addresses.slice(0, amountOfDisplayedAddresses).map(renderListItem);

    const remainingAddresses = addresses.slice(amountOfDisplayedAddresses).map(renderListItem);

    const getAddressesListItems = () => {
        if (amountOfAddresses === 0) {
            return (
                <li className="pt0-5 pb0-5">
                    {amountOfAddresses}
                    <span className="no-mobile"> {addressesPluralized}</span>
                </li>
            );
        }

        if (expanded) {
            return [...initiallyDisplayedAddresses, ...remainingAddresses];
        }

        if (remainingAddresses.length > 0) {
            const expandButton = (
                <li key="expand" className="mb0-5">
                    <Button onClick={handleExpandClick} shape="ghost" color="norm" className="flex flex-align-items-center">
                        {remainingAddresses.length} {c('Info').t`more`}{' '}
                        <span className="no-mobile mr0-5">{addressesPluralized}</span>
                        <Icon size={12} name="caret" />
                    </Button>
                </li>
            );

            return [...initiallyDisplayedAddresses, expandButton];
        }

        return initiallyDisplayedAddresses;
    };

    return <ul className="unstyled mt-0-5 mb-0-5">{getAddressesListItems()}</ul>;
};

MemberAddresses.propTypes = {
    addresses: PropTypes.array.isRequired,
};

export default MemberAddresses;
