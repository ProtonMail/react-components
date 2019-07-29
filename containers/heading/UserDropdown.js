import React, { useState } from 'react';
import { c } from 'ttag';
import {
    useAddresses,
    useUser,
    useAuthentication,
    useModals,
    usePopperAnchor,
    Icon,
    Dropdown,
    BugModal,
    DonateModal,
    generateUID
} from 'react-components';
import UserDropdownButton from './UserDropdownButton';

const UserDropdown = (props) => {
    const [[{ Email = '' }] = []] = useAddresses();
    const [{ Name }] = useUser();
    const { logout } = useAuthentication();
    const { createModal } = useModals();
    const [uid] = useState(generateUID('dropdown'));
    const { anchorRef, isOpen, toggle, close } = usePopperAnchor();

    const handleBugReportClick = () => {
        createModal(<BugModal />);
    };

    const handleSupportUsClick = () => {
        createModal(<DonateModal />);
    };

    return (
        <div className="userDropdown">
            <UserDropdownButton
                {...props}
                aria-describedby={uid}
                buttonRef={anchorRef}
                isOpen={isOpen}
                onClick={toggle}
            />
            <Dropdown id={uid} isOpen={isOpen} anchorRef={anchorRef} onClose={close} originalPlacement="bottom-right">
                <ul className="unstyled mt0-5 mb0-5">
                    <li className="dropDown-item p1 flex flex-column">
                        <strong title="Yiin" className="ellipsis mw100 capitalize">
                            {Name}
                        </strong>
                        <span title="assvxcvsddsa@pm.me" className="ellipsis mw100">
                            {Email}
                        </span>
                    </li>
                    <li className="dropDown-item pl1 pr1">
                        <a className="w100 flex flex-nowrap pm-button--link p0" href="/settings">
                            <Icon className="mt0-25 mr0-5 fill-currentColor" size={16} name="settings" />
                            {c('Action').t`Settings`}
                        </a>
                    </li>
                    <li className="dropDown-item pl1 pr1">
                        <a className="w100 flex flex-nowrap pm-button--link p0" href="/support">
                            <Icon className="mt0-25 mr0-5 fill-currentColor" size={16} name="support1" />
                            {c('Action').t`Troubleshooting & Help`}
                        </a>
                    </li>
                    <li className="dropDown-item pl1 pr1">
                        <a className="w100 flex flex-nowrap pm-button--link p0" href="/support-form">
                            <Icon className="mt0-25 mr0-5 fill-currentColor" size={16} name="help-answer" />
                            {c('Action').t`Contact support`}
                        </a>
                    </li>
                    <li className="dropDown-item pl1 pr1">
                        <button className="w100 flex link pt0-5 pb0-5 alignleft" onClick={handleBugReportClick}>
                            <Icon className="mt0-25 mr0-5 fill-currentColor" size={16} name="report-bug" />
                            {c('Action').t`Report bug`}
                        </button>
                    </li>
                    <li className="dropDown-item pl1 pr1">
                        <a className="w100 flex flex-nowrap pm-button--link p0" href="https://shop.protonmail.com">
                            <Icon className="mt0-25 mr0-5 fill-currentColor" size={16} name="shop" />
                            {c('Action').t`Proton shop`}
                        </a>
                    </li>
                    <li className="dropDown-item pt0-5 pb0-5 pl1 pr1">
                        <button className="w100 flex link pt0-5 pb0-5 alignleft" onClick={handleSupportUsClick}>
                            <Icon className="mt0-25 mr0-5 fill-currentColor" size={16} name="donate" />
                            {c('Action').t`Support us`}
                        </button>
                    </li>
                    <li className="dropDown-item p1 flex">
                        <button className="w100 pm-button--primary aligncenter navigationUser-logout" onClick={logout}>
                            {c('Action').t`Logout`}
                        </button>
                    </li>
                </ul>
            </Dropdown>
        </div>
    );
};

export default UserDropdown;
