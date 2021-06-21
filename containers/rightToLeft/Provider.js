import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import RightToLeftContext from './context';

const Provider = ({ children }) => {
    // TODO: get initial state from settings, or derive from locale
    const [isRTL, setRTL] = useState(document.documentElement.lang === 'fa');

    console.log(document.documentElement.lang === 'fa');

    useEffect(() => {
        if (document.documentElement.lang === 'fa') {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }
    }, [isRTL]);

    return <RightToLeftContext.Provider value={{ isRTL, setRTL }}>{children}</RightToLeftContext.Provider>;
};

Provider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Provider;
