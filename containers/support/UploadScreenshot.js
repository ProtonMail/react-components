import React, { useState } from 'react';
import { c } from 'ttag';
import { Text, Icon, Button, InputFile, useNotifications } from 'react-components';
import PropTypes from 'prop-types';

const UploadScreenshot = ({ id, onUpload, onReset }) => {
    const [uploaded, setUpload] = useState(false);
    const { createNotification } = useNotifications();

    const handleClick = () => {
        setUpload(false);
        onReset();
    };

    const handleChange = ({ target }) => {
        const images = [...target.files].filter(({ type }) => /^image\//i.test(type));

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
                    <Icon name="insert-image" /> {c('Info').t`Screenshot(s) attached`}
                </Text>
                <Button onClick={handleClick}>{c('Action').t`Clear`}</Button>
            </>
        );
    }

    return (
        <InputFile className="mr1" multiple accept="image/*" id={id} onChange={handleChange}>{c('Action')
            .t`Add screenshots`}</InputFile>
    );
};

UploadScreenshot.propTypes = {
    id: PropTypes.string,
    onUpload: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired
};

export default UploadScreenshot;
