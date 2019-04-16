import React, { useState } from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { updateOrganizationName } from 'proton-shared/lib/api/organization';
import {
    Text,
    SmallButton,
    useModal,
    InputModal,
    useApiWithoutResult,
    useEventManager,
    useNotifications
} from 'react-components';

const OrganizationName = ({ organization }) => {
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const { isOpen, open, close } = useModal();
    const [name, setName] = useState(organization.Name);
    const { request, loading } = useApiWithoutResult(updateOrganizationName);

    const handleSubmit = async (name) => {
        await request(name);
        await call();
        setName(name);
        close();
        createNotification({ text: c('Success').t`Organization name updated` });
    };

    return (
        <>
            <Text className="mr1">{name}</Text>
            <SmallButton onClick={open}>{c('Action').t`Edit`}</SmallButton>
            <InputModal
                show={isOpen}
                loading={loading}
                input={name}
                title={c('Title').t`Change organization name`}
                label={c('Label').t`Organization name`}
                placeholder={c('Placeholder').t`Choose a name`}
                onClose={close}
                onSubmit={handleSubmit}
            />
        </>
    );
};

OrganizationName.propTypes = {
    organization: PropTypes.object.isRequired
};

export default OrganizationName;
