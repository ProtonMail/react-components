import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Modal, HeaderModal, FooterModal, ContentModal, ResetButton, PrimaryButton } from 'react-components';
import { LABEL_TYPES, LABEL_COLORS } from 'proton-shared/lib/constants';
import { randomIntFromInterval } from 'proton-shared/lib/helpers/function';

import NewLabelForm from '../../../components/Labels/NewLabelForm';

function EditLabelModal({ show, label, onSubmit, onClose, loading, ...props }) {
    const I18N = {
        edition({ Name, Exclusive } = {}) {
            if (Exclusive === LABEL_TYPES.LABEL) {
                return c('Label/folder modal').t`Edit label: ${Name}`;
            }
            return c('Label/folder modal').t`Edit folder: ${Name}`;
        },
        create({ Name } = {}, type) {
            if (type === 'label') {
                return c('Label/folder modal').t`Create a new label: ${Name}`;
            }
            return c('Label/folder modal').t`Create a new folder: ${Name}`;
        }
    };

    const [model, setModel] = useState(
        label || {
            Name: '',
            Color: LABEL_COLORS[randomIntFromInterval(0, LABEL_COLORS.length - 1)],
            Exclusive: +(props.type === 'folder')
        }
    );

    useEffect(() => {
        setModel(model);
    }, [model]);

    const handleSubmit = () => onSubmit(model);
    const handleChangeColor = (Color) => () => {
        setModel({
            ...model,
            Color
        });
    };

    const handleChangeName = ({ target }) => {
        setModel({
            ...model,
            Name: target.value
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <HeaderModal onClose={onClose}>{I18N[props.mode](label, props.type)}</HeaderModal>
            <ContentModal onSubmit={handleSubmit} onReset={onClose} loading={loading}>
                <NewLabelForm label={model} onChangeName={handleChangeName} onChangeColor={handleChangeColor} />
                <FooterModal>
                    <ResetButton>{c('New Label form').t`Cancel`}</ResetButton>
                    <PrimaryButton type="submit">{c('New Label form').t`Save`}</PrimaryButton>
                </FooterModal>
            </ContentModal>
        </Modal>
    );
}

EditLabelModal.propTypes = {
    show: PropTypes.bool.isRequired,
    type: PropTypes.string,
    label: PropTypes.object,
    mode: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

EditLabelModal.defaultProps = {
    show: false,
    mode: 'create'
};

export default EditLabelModal;
