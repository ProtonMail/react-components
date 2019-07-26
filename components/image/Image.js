import React, { useState } from 'react';
import { c } from 'ttag';
import { SHOW_IMAGES } from 'proton-shared/lib/constants';
import Button from '../button/Button';
import useMailSettings from '../../hooks/useMailSettings';

const Image = (props) => {
    const [{ ShowImages }] = useMailSettings();
    const [showAnyways, setShowAnyways] = useState(false);

    const handleClick = () => setShowAnyways(true);

    if (ShowImages & SHOW_IMAGES.REMOTE || showAnyways) {
        return <img {...props} />;
    }
    return <Button onClick={handleClick}>{c('Action').t`Load image`}</Button>;
};

export default Image;
