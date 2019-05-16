import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { PrimaryButton, useApiWithoutResult, useModal, useNotifications } from 'react-components';
import { addIncomingDefault } from 'proton-shared/lib/api/incomingDefaults';
import { noop } from 'proton-shared/lib/helpers/function';
import { MAILBOX_IDENTIFIERS } from 'proton-shared/lib/constants';

import AddEmailToListModal from '../../../containers/Filters/AddEmailToListModal';

const BLACKLIST_TYPE = +MAILBOX_IDENTIFIERS.spam;
const WHITELIST_TYPE = +MAILBOX_IDENTIFIERS.inbox;

function AddEmailFilterListButton({ type, className, onAdd }) {
    const { createNotification } = useNotifications();
    const { request, loading } = useApiWithoutResult(addIncomingDefault);
    const { isOpen, open, close } = useModal();

    const I18N = {
        blacklist: c('Title').t('blacklist'),
        whitelist: c('Title').t('whitelist')
    };

    const handelClick = open;
    const handleCloseModal = close;

    const handleSubmitModal = async (Email) => {
        const Location = type === 'whitelist' ? WHITELIST_TYPE : BLACKLIST_TYPE;
        const { IncomingDefault: data } = await request({ Location, Email });
        createNotification({
            text: c('Spam notification').t(`${Email} added to ${I18N[type]}`)
        });
        onAdd(type, data);
        close();
    };

    return (
        <>
            <PrimaryButton className={className} onClick={handelClick}>
                {c('Action').t('Add')}
            </PrimaryButton>
            {isOpen ? (
                <AddEmailToListModal
                    type={type}
                    loading={loading}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitModal}
                />
            ) : null}
        </>
    );
}

AddEmailFilterListButton.propTypes = {
    className: PropTypes.string,
    onAdd: PropTypes.func
};

AddEmailFilterListButton.defaultProps = {
    onAdd: noop
};

export default AddEmailFilterListButton;
