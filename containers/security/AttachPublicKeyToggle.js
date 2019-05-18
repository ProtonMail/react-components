import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    ConfirmModal,
    Toggle,
    Alert,
    useApiWithoutResult,
    useModals,
    useEventManager,
    useToggle
} from 'react-components';
import { updateAttachPublicKey, updateSign } from 'proton-shared/lib/api/mailSettings';

const AttachPublicKeyToggle = ({ id, attachPublicKey, sign }) => {
    const { createModal } = useModals();
    const { call } = useEventManager();
    const { request, loading } = useApiWithoutResult(updateAttachPublicKey);
    const { request: requestSign } = useApiWithoutResult(updateSign);
    const { state, toggle } = useToggle(!!attachPublicKey);

    const handleConfirmSign = async () => {
        await requestSign(1);
        await call();
    };

    const handleChange = async ({ target }) => {
        askSign(target.checked);
        await request(+target.checked);
        call();
        toggle();
    };

    const handleOpenModal = () => {
        createModal(
            <ConfirmModal
                confirm={c('Action').t`Yes`}
                cancel={c('Action').t`No`}
                title={c('Title').t`Automatically sign outgoing messages?`}
                onConfirm={handleConfirmSign}
            >
                <Alert>
                    {c('Info')
                        .t`PGP clients are more likely to automatically detect your PGP keys if outgoing messages are signed.`}
                </Alert>
            </ConfirmModal>
        );
    };

    const askSign = (newValue) => {
        if (!newValue || sign) {
            return false;
        }
        handleOpenModal();
    };

    return <Toggle id={id} checked={state} onChange={handleChange} loading={loading} />;
};

AttachPublicKeyToggle.propTypes = {
    id: PropTypes.string,
    attachPublicKey: PropTypes.number.isRequired,
    sign: PropTypes.number.isRequired
};

export default AttachPublicKeyToggle;
