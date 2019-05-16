import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Modal, HeaderModal, InnerModal, FooterModal, ContentModal, PrimaryButton, Button } from 'react-components';
import { newFilter, format as formatFilter } from 'proton-shared/lib/filters/factory';
import { validate, validateComplex } from 'proton-shared/lib/filters/validator';

import ConditionsEditor from '../../components/Filters/editor/Conditions';
import ActionsEditor from '../../components/Filters/editor/Actions';
import OperatorEditor from '../../components/Filters/editor/Operator';
import SieveEditor from '../../components/Filters/editor/Sieve';
import PreviewFilter from '../../components/Filters/editor/Preview';
import NameEditor from '../../components/Filters/editor/Name';

import './AddFilterModal.css';

function AddFilterModal({ filter, type, onSubmit, loading, ...props }) {
    const filterModel = newFilter(filter, type);
    const [errors, setErrors] = useState({});
    const [model, setModel] = useState(filterModel);
    const [isPreview, setPreview] = useState(false);
    const [isInvalid, setValitidy] = useState(false);
    const [sieveCode, setSieveCode] = useState(filterModel.Sieve || '');

    const handleChange = (key) => (data) => {
        setModel((previous) => {
            return {
                ...previous,
                Simple: {
                    ...previous.Simple,
                    [key]: Array.isArray(data) ? data : { ...previous.Simple[key], ...data }
                }
            };
        });
    };

    const validateFilter = (filter) => {
        if (type === 'complex') {
            const { isValid, ...errors } = validateComplex(filter);
            if (isInvalid || !isValid) {
                setErrors(errors);
                return false;
            }

            return true;
        }

        const { isValid, ...errors } = validate(filter);

        if (!isValid) {
            setErrors(errors);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (type === 'complex') {
            const filter = {
                ...model,
                Sieve: sieveCode
            };
            const isValid = validateFilter(filter);
            return isValid && onSubmit(formatFilter(filter, 'complex'));
        }

        const filter = formatFilter(model, 'simple');
        const isValid = validateFilter(filter);
        isValid && onSubmit(filter);
    };

    const handleChangeName = (Name) => setModel({ ...model, Name });
    const handleClickPreview = () => setPreview(!isPreview);
    const handleChangeBeforeLint = () => setValitidy(true);
    const handleChangeSieve = (err, code) => {
        setValitidy(err);
        if (!err) {
            setSieveCode(code);
        }
    };

    return (
        <Modal {...props} loading={loading}>
            <HeaderModal onClose={props.onClose}>
                {!isPreview ? c('Add Filter Modal').t`Custom Filter` : c('Add Filter Modal').t`Custom Filter (Preview)`}
            </HeaderModal>

            <ContentModal
                onSubmit={handleSubmit}
                loading={loading}
                className={isPreview ? 'AddFilterModal-isPreview' : ''}
                noValidate
            >
                {type === 'complex' ? (
                    <InnerModal className="AddFilterModal-editor">
                        <NameEditor error={errors.name} filter={filterModel} onChange={handleChangeName} />
                        <SieveEditor
                            filter={filterModel}
                            onChange={handleChangeSieve}
                            onChangeBeforeLint={handleChangeBeforeLint}
                        />
                    </InnerModal>
                ) : null}

                {type !== 'complex' ? (
                    <InnerModal className="AddFilterModal-editor">
                        <NameEditor error={errors.name} filter={filterModel} onChange={handleChangeName} />
                        <OperatorEditor filter={filterModel} onChange={handleChange('Operator')} />
                        <ConditionsEditor
                            errors={errors.conditions}
                            filter={filterModel}
                            onChange={handleChange('Conditions')}
                        />
                        <ActionsEditor
                            errors={errors.actions}
                            filter={filterModel}
                            onChange={handleChange('Actions')}
                        />
                    </InnerModal>
                ) : null}

                {isPreview ? (
                    <InnerModal>
                        <PreviewFilter filter={model} />
                    </InnerModal>
                ) : null}

                {isPreview ? (
                    <FooterModal>
                        <Button type="button" onClick={handleClickPreview}>{c('Action').t`Back`}</Button>
                        <PrimaryButton disabled={loading}>{c('Action').t`Save`}</PrimaryButton>
                    </FooterModal>
                ) : null}

                {!isPreview ? (
                    <FooterModal>
                        <Button onClick={props.onClose}>{c('Action').t`Close`}</Button>
                        {type !== 'complex' ? (
                            <Button type="button" className="mlauto mr1" onClick={handleClickPreview}>{c('Action')
                                .t`Preview`}</Button>
                        ) : null}
                        <PrimaryButton type="submit" disabled={loading}>
                            {c('Action').t`Save`}
                        </PrimaryButton>
                    </FooterModal>
                ) : null}
            </ContentModal>
        </Modal>
    );
}

AddFilterModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

AddFilterModal.defaultProps = {
    show: false,
    mode: 'create'
};

export default AddFilterModal;
