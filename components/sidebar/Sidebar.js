import React from 'react';
import PropTypes from 'prop-types';

import NavMenu from './NavMenu';
import MobileNavServices from './MobileNavServices';
import MobileNavLink from './MobileNavLink';
import MainLogo from '../logo/MainLogo';

const Sidebar = ({ expanded = false, list = [], mobileLinks = [], url = '' }) => {
    return (
        <div className="sidebar flex flex-column noprint" data-expanded={expanded}>
            <div className="nodesktop notablet flex-item-noshrink">
                <MainLogo url={url} />
            </div>
            <nav className="navigation mw100 flex-item-fluid scroll-if-needed mb1">
                <NavMenu list={list} />
            </nav>
            {mobileLinks.length ? (
                <MobileNavServices className="nodesktop notablet flex-item-noshrink">
                    {mobileLinks.map(({ to, icon, external }) => {
                        return <MobileNavLink key={icon} to={to} icon={icon} external={external} />;
                    })}
                </MobileNavServices>
            ) : null}
        </div>
    );
};

Sidebar.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object),
    mobileLinks: PropTypes.arrayOf(PropTypes.object),
    url: PropTypes.string.isRequired,
    expanded: PropTypes.bool
};

export default Sidebar;
