import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    Modal,
    Href,
    Alert,
    Row,
    Input,
    Label,
    ContentModal,
    FooterModal,
    ResetButton,
    PrimaryButton
} from 'react-components';

const ReportBugModal = ({ show, onClose, extraContent }) => {
    const [model, set] = useState({
        extraContent
    });
    const link = (
        <Href url="https://protonmail.com/support/knowledge-base/how-to-clean-cache-and-cookies/">{c('Link')
            .t`clearing your browser cache`}</Href>
    );
    const handleChange = (key) => ({ target }) => set({ ...model, [key]: target.value });
    const handleSubmit = () => {};
    const [loading] = useState(false);
    return (
        <Modal show={show} onClose={onClose} title={c('Title').t`Report bug`}>
            <ContentModal onSubmit={handleSubmit} onReset={onClose} loading={loading}>
                <Alert>{c('Info').jt`Refreshing the page or ${link} will automatically resolve most issues.`}</Alert>
                <Row>
                    <Label>{c('Operating system')}</Label>
                    <Input value={model.os} onChange={handleChange('os')} />
                </Row>
                <FooterModal>
                    <ResetButton>{c('Action').t`Cancel`}</ResetButton>
                    <PrimaryButton type="submit">{c('Action').t`Submit`}</PrimaryButton>
                </FooterModal>
            </ContentModal>
        </Modal>
    );
};

ReportBugModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    extraContent: PropTypes.string
};

ReportBugModal.defaultProps = {
    extraContent: ''
};

export default ReportBugModal;
