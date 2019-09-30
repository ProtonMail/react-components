import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const MainContainer = ({ children, location, rootRef }) => {
    const fallbackRef = useRef();
    const containerRef = rootRef || fallbackRef;

    // Reset scroll position when pathname changes
    useEffect(() => {
        rootRef.current.scrollTop = 0;
    }, [location.pathname]);

    return (
        <main ref={containerRef} className="main flex-item-fluid main-area scroll-smooth-touch">
            {children}
        </main>
    );
};

MainContainer.propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    rootRef: PropTypes.object
};

export default withRouter(MainContainer);
