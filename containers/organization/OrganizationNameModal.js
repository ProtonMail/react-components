import React, { useState } from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { updateOrganizationName } from 'proton-shared/lib/api/organization';
import { InputModal, useEventManager, useApi } from 'react-components';

const OrganizationNameModal = ({ onClose, organizationName, ...rest }) => {
    const api = useApi();
    const { call } = useEventManager();
    const [loading, setLoading] = useState();

    const handleSubmit = async (name) => {
        try {
            setLoading(true);
            await api(updateOrganizationName(name));
            await call();
            onClose();
        } catch (e) {
            setLoading(false);
        }
    };

    return (
        <InputModal
            input={organizationName}
            loading={loading}
            title={c('Title').t`Change organization name`}
            label={c('Label').t`Organization name`}
            placeholder={c('Placeholder').t`Choose a name`}
            onSubmit={(name) => handleSubmit(name)}
            onClose={onClose}
            {...rest}
        />
    );
};

OrganizationNameModal.propTypes = {
    organizationName: PropTypes.string.isRequired,
    onClose: PropTypes.func
};

export default OrganizationNameModal;
