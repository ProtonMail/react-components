import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { reportBug } from 'proton-shared/lib/api/reports';
import { getOS, getBrowser, getDevice } from 'proton-shared/lib/helpers/browser';
import { toBase64 } from 'proton-shared/lib/helpers/file';
import { downSize, toBlob } from 'proton-shared/lib/helpers/image';
import { MAX_SIZE_SCREENSHOT } from 'proton-shared/lib/constants';
import { c } from 'ttag';
import {
    Modal,
    Href,
    Alert,
    Row,
    Input,
    TextArea,
    Label,
    ContentModal,
    FooterModal,
    EmailInput,
    ResetButton,
    PrimaryButton,
    useApiWithoutResult,
    useUser,
    useAddresses,
    useNotifications
} from 'react-components';
import UploadScreenshot from './UploadScreenshot';

const BugModal = ({ show, onClose }) => {
    const [{ Name = '' }] = useUser();
    const { createNotification } = useNotifications();

    const [addresses = []] = useAddresses();
    const [{ Email = '' } = {}] = addresses;
    const os = getOS();
    const browser = getBrowser();
    const device = getDevice();
    const [model, update] = useState({
        OS: os.name,
        OSVersion: os.version || '',
        Browser: browser.name,
        BrowserVersion: browser.version,
        Resolution: `${window.innerHeight} x ${window.innerWidth}`,
        Client: 'ProtonMail Settings React',
        ClientVersion: 'TODO',
        ClientType: 'TODO',
        DeviceName: device.vendor,
        DeviceModel: device.model,
        Title: `[ProtonMail Settings React] Bug [${location.path}]`,
        Description: '',
        Username: Name,
        Email
    });
    const { request, loading } = useApiWithoutResult(reportBug);
    const link = (
        <Href url="https://protonmail.com/support/knowledge-base/how-to-clean-cache-and-cookies/">{c('Link')
            .t`clearing your browser cache`}</Href>
    );
    const handleChange = (key) => ({ target }) => update({ ...model, [key]: target.value });

    const handleReset = () => {
        // eslint-disable-next-line no-unused-vars
        const { Attachments, ...newModel } = model;
        update(newModel);
    };

    const handleUpload = (images) => update({ ...model, Attachments: images });

    const resize = async (file) => {
        const base64str = await toBase64(file);
        return downSize(base64str, MAX_SIZE_SCREENSHOT, file.type);
    };

    const format = (parameters = {}) => {
        const { promises, formData } = Object.entries(parameters).reduce(
            (acc, [key, value]) => {
                // NOTE FileList instanceof Array => false
                if (value instanceof FileList || value instanceof Array) {
                    for (let i = 0; i < value.length; i++) {
                        const file = value[i];
                        const promise = resize(file).then((base64str) => {
                            acc[file.name] = toBlob(base64str);
                        });

                        acc.promises.push(promise);
                    }

                    return acc;
                }

                acc[key] = value;

                return acc;
            },
            { promises: [], formData: {} }
        );

        return Promise.all(promises)
            .then(() => formData)
            .catch(() => formData);
    };

    const handleSubmit = async () => {
        await request(format(model), 'form');
        onClose();
        createNotification({ text: c('Success').t`Bug reported` });
    };

    return (
        <Modal show={show} onClose={onClose} title={c('Title').t`Report bug`}>
            <ContentModal onSubmit={handleSubmit} onReset={onClose} loading={loading}>
                <Alert>{c('Info').jt`Refreshing the page or ${link} will automatically resolve most issues.`}</Alert>
                <Alert type="warning">{c('Warning')
                    .t`Bug reports are not end-to-end encrypted, please do not send any sensitive information.`}</Alert>
                <Row>
                    <Label htmlFor="OS">{c('Label').t`Operating system`}</Label>
                    <Input
                        id="OS"
                        value={model.OS}
                        onChange={handleChange('OS')}
                        placeholder={c('Placeholder').t`OS name`}
                    />
                </Row>
                <Row>
                    <Label htmlFor="OSVersion">{c('Label').t`Operating system version`}</Label>
                    <Input
                        id="OSVersion"
                        value={model.OSVersion}
                        onChange={handleChange('OSVersion')}
                        placeholder={c('Placeholder').t`OS version`}
                    />
                </Row>
                <Row>
                    <Label htmlFor="Browser">{c('Label').t`Browser`}</Label>
                    <Input
                        id="Browser"
                        value={model.Browser}
                        onChange={handleChange('Browser')}
                        placeholder={c('Placeholder').t`Browser name`}
                    />
                </Row>
                <Row>
                    <Label htmlFor="BrowserVersion">{c('Label').t`Browser version`}</Label>
                    <Input
                        id="BrowserVersion"
                        value={model.BrowserVersion}
                        onChange={handleChange('BrowserVersion')}
                        placeholder={c('Placeholder').t`Browser version`}
                    />
                </Row>
                <Row>
                    <Label htmlFor="Email">{c('Label').t`Email address`}</Label>
                    <EmailInput
                        id="Email"
                        value={model.Email}
                        onChange={handleChange('Email')}
                        placeholder={c('Placeholder').t`Please make sure to give us a way to contact you`}
                        required
                    />
                </Row>
                <Row>
                    <Label htmlFor="Description">{c('Label').t`What happened?`}</Label>
                    <TextArea
                        id="Description"
                        value={model.Description}
                        onChange={handleChange('Description')}
                        placeholder={c('Placeholder').t`Please describe the problem and include any error messages`}
                        required
                    />
                </Row>
                <Row>
                    <Label htmlFor="Attachments">{c('Label').t`Attach screenshots`}</Label>
                    <UploadScreenshot id="Attachments" onUpload={handleUpload} onReset={handleReset} />
                </Row>
                <Alert>{c('Info').t`Contact us at security@protonmail.com for critical security issues.`}</Alert>
                <FooterModal>
                    <ResetButton>{c('Action').t`Cancel`}</ResetButton>
                    <PrimaryButton type="submit">{c('Action').t`Submit`}</PrimaryButton>
                </FooterModal>
            </ContentModal>
        </Modal>
    );
};

BugModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default BugModal;
