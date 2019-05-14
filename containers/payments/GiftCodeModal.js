import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    Modal,
    ContentModal,
    FooterModal,
    ResetButton,
    PrimaryButton,
    Row,
    Field,
    Label,
    useApiWithoutResult,
    useEventManager,
    useNotifications
} from 'react-components';
import { validateCredit, buyCredit } from 'proton-shared/lib/api/payments';

import GiftCodeInput from './GiftCodeInput';

const GiftCodeModal = ({ show, onClose }) => {
    const [loading, setLoading] = useState(false);
    const { request: requestBuyCredit } = useApiWithoutResult(buyCredit);
    const { request: requestValidateCredit } = useApiWithoutResult(validateCredit);
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const [value, setValue] = useState('');
    const handleChange = ({ target }) => setValue(target.value);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await requestValidateCredit({ GiftCode: value });
            await requestBuyCredit({ GiftCode: value, Amount: 0 });
            await call();
            onClose();
            createNotification({ text: c('Success').t`Gift code applied` });
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    return (
        <Modal type="small" show={show} onClose={onClose} title={c('Title').t`Gift code`}>
            <ContentModal onSubmit={handleSubmit} onReset={onClose} loading={loading}>
                <Row>
                    <Label htmlFor="giftCodeInput">{c('Label').t`Enter gift code`}</Label>
                    <Field>
                        <GiftCodeInput id="giftCodeInput" value={value} onChange={handleChange} required={true} />
                    </Field>
                </Row>
                <FooterModal>
                    <ResetButton>{c('Action').t`Close`}</ResetButton>
                    <PrimaryButton type="submit">{c('Action').t`Save`}</PrimaryButton>
                </FooterModal>
            </ContentModal>
        </Modal>
    );
};

GiftCodeModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default GiftCodeModal;
