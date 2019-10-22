import React from 'react';
import PropTypes from 'prop-types';

import NavMenu from './NavMenu';
import MainLogo from '../logo/MainLogo';
import Hamburger from './Hamburger';

const Sidebar = ({ expanded = false, onToggleExpand, list = [], url = '/account', children }) => {
    return (
        <div className="sidebar flex flex-column noprint" data-expanded={expanded}>
            <div className="nodesktop notablet flex flex-spacebetween flex-items-center">
                <MainLogo url={url} />
                <Hamburger expanded={expanded} onToggle={onToggleExpand} />
            </div>
            {children}
            <nav className="navigation mw100 flex-item-fluid scroll-if-needed mb1">
                <NavMenu list={list} />
            </nav>
        </div>
    );
};

Sidebar.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object),
    url: PropTypes.string,
    expanded: PropTypes.bool,
    onToggleExpand: PropTypes.func,
    children: PropTypes.node
};

export default Sidebar;
