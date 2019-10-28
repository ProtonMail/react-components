import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { SHOW_IMAGES } from 'proton-shared/lib/constants';
import { isURL } from 'proton-shared/lib/helpers/validators';
import Button from '../button/Button';
import useMailSettings from '../../hooks/useMailSettings';

const RemoteImage = ({ src, show = false, ...rest }) => {
    const [{ ShowImages }, loading] = useMailSettings();
    const [showAnyways, setShowAnyways] = useState(show || !isURL(src));

    const handleClick = () => setShowAnyways(true);

    if ((!loading && ShowImages & SHOW_IMAGES.REMOTE) || showAnyways) {
        return <img src={src} {...rest} />;
    }
    return <Button onClick={handleClick}>{c('Action').t`Load image`}</Button>;
};

RemoteImage.propTypes = {
    src: PropTypes.string.isRequired,
    show: PropTypes.bool
};

export default RemoteImage;
