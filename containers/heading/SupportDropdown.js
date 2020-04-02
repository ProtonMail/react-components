import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Icon,
    Dropdown,
    useModals,
    AuthenticatedBugModal,
    useAuthentication,
    usePopperAnchor,
    generateUID,
    useConfig,
    BugModal
} from 'react-components';
import { c } from 'ttag';
import { CLIENT_TYPES } from 'proton-shared/lib/constants';

import SupportDropdownButton from './SupportDropdownButton';

const { VPN } = CLIENT_TYPES;

const SupportDropdown = ({ className, content }) => {
    const { UID } = useAuthentication();
    const { CLIENT_TYPE } = useConfig();
    const { createModal } = useModals();
    const [uid] = useState(generateUID('dropdown'));
    const { anchorRef, isOpen, toggle, close } = usePopperAnchor();
    const isAuthenticated = !!UID;

    const handleBugReportClick = () => {
        createModal(isAuthenticated ? <AuthenticatedBugModal /> : <BugModal />);
    };

    return (
        <>
            <SupportDropdownButton
                className={className}
                content={content}
                aria-describedby={uid}
                buttonRef={anchorRef}
                isOpen={isOpen}
                onClick={toggle}
            />
            <Dropdown id={uid} isOpen={isOpen} anchorRef={anchorRef} onClose={close} originalPlacement="bottom">
                <ul className="unstyled mt0 mb0">
                    <li className="dropDown-item">
                        <a
                            className="dropDown-item-link w100 flex flex-nowrap pl1 pr1 pt0-5 pb0-5"
                            href={
                                CLIENT_TYPE === VPN
                                    ? 'https://protonvpn.com/support/'
                                    : 'https://protonmail.com/support/'
                            }
                            // eslint-disable-next-line react/jsx-no-target-blank
                            target="_blank"
                        >
                            <Icon className="mt0-25 mr0-5" name="what-is-this" />
                            {c('Action').t`I have a question`}
                        </a>
                    </li>
                    <li className="dropDown-item">
                        <button
                            type="button"
                            className="dropDown-item-button w100 flex flex-nowrap pl1 pr1 pt0-5 pb0-5 alignleft"
                            onClick={handleBugReportClick}
                        >
                            <Icon className="mt0-25 mr0-5" name="report-bug" />
                            {c('Action').t`Report bug`}
                        </button>
                    </li>
                </ul>
            </Dropdown>
        </>
    );
};

SupportDropdown.propTypes = {
    className: PropTypes.string,
    content: PropTypes.string
};

export default SupportDropdown;
