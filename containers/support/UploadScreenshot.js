import React, { useState } from 'react';
import { c } from 'ttag';
import { Text, Icon, Button, Input, LearnMore, useNotifications } from 'react-components';
import PropTypes from 'prop-types';

const UploadScreenshot = ({ id, onUpload, onReset }) => {
    const [uploaded, setUpload] = useState(false);
    const { createNotification } = useNotifications();

    const handleClick = () => {
        setUpload(false);
        onReset();
    };

    const handleChange = ({ target }) => {
        const images = target.files.filter(({ type }) => /^image\//i.test(type));

        if (images.length) {
            setUpload(true);
            onUpload(images);
        } else {
            createNotification({
                type: 'error',
                text: c('Error notification in the bug report modal when the user upload file').t`No image selected`
            });
        }
    };

    if (uploaded) {
        return (
            <>
                <Text>
                    <Icon name="insert-image" />
                    {c('Info').t`Screenshot(s) attached`}
                </Text>
                <Button onClick={handleClick}>{c('Action').t`Clear`}</Button>
            </>
        );
    }

    return (
        <>
            <Input className="pm-button" type="file" multiple accept="image/*" id={id} onChange={handleChange} />
            <LearnMore url="https://protonmail.com/support/knowledge-base/screenshot-reporting-bugs/" />
        </>
    );
};

UploadScreenshot.propTypes = {
    id: PropTypes.string,
    onUpload: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired
};

export default UploadScreenshot;
