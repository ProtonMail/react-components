import React from 'react';
import PropTypes from 'prop-types';
import { useAddresses, useUser, DropdownCaret } from 'react-components';

const UserDropdownButton = ({ isOpen, buttonRef, ...rest }) => {
    const [[{ Email = '' }] = []] = useAddresses();
    const [{ Name }] = useUser();

    return (
        <button className="color-white inline-flex" aria-expanded={isOpen} ref={buttonRef} {...rest}>
            <span className="alignright">
                <span className="bl capitalize">{Name}</span>
                <span className="bl smaller m0 opacity-30 lh100">{Email}</span>
            </span>
            <DropdownCaret isOpen={isOpen} className="icon-12p ml0-5 mr0-5 expand-caret mtauto mbauto" />
            <span className="mtauto mbauto bordered rounded50 p0-5 inbl dropDown-logout-initials">DW</span>
        </button>
    );
};

UserDropdownButton.propTypes = {
    className: PropTypes.string,
    isOpen: PropTypes.bool,
    buttonRef: PropTypes.object
};

export default UserDropdownButton;
