import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';

import HrefLink from './href';

const LearnMore = ({ url }) => {
    return <HrefLink url={url}>{c('Link').t`Learn more`}</HrefLink>;
};

LearnMore.propTypes = {
    url: PropTypes.string.isRequired
};

export default LearnMore;
