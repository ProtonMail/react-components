import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { FormModal, useNotifications, useApiWithoutResult, Radio, Row, Label, Field } from 'react-components';
import { addIncomingDefault } from 'proton-shared/lib/api/incomingDefaults';
import { noop } from 'proton-shared/lib/helpers/function';
import { MAILBOX_IDENTIFIERS } from 'proton-shared/lib/constants';

import AddEmailToList from './spamlist/AddEmailToList';
import AddDomainToList from './spamlist/AddDomainToList';

const BLACKLIST_TYPE = +MAILBOX_IDENTIFIERS.spam;
const WHITELIST_TYPE = +MAILBOX_IDENTIFIERS.inbox;
const EMAIL_MODE = 'email';
const DOMAIN_MODE = 'domain';

function AddEmailToListModal({ type, onAdd = noop, onClose, ...rest }) {
    const I18N = {
        blacklist: c('Title').t`Add to blacklist`,
        whitelist: c('Title').t`Add to whitelist`
    };

    const { createNotification } = useNotifications();
    const { request, loading } = useApiWithoutResult(addIncomingDefault);
    const [mode, setMode] = useState(EMAIL_MODE);
    const [email, setEmail] = useState('');
    const [domain, setDomain] = useState('');

    const handleSubmit = async () => {
        const Location = type === 'whitelist' ? WHITELIST_TYPE : BLACKLIST_TYPE;
        const { IncomingDefault: data } = await request({
            Location,
            ...(mode === EMAIL_MODE ? { Email: email } : { Domain: domain })
        });
        createNotification({
            text: c('Spam notification').t`${mode === EMAIL_MODE ? email : domain} added to ${I18N[type]}`
        });
        onAdd(type, data);
        onClose();
    };

    return (
        <FormModal
            onSubmit={handleSubmit}
            loading={loading}
            title={I18N[type]}
            submit={c('Action').t`Save`}
            onClose={onClose}
            {...rest}
        >
            <Row>
                <Label>{c('Label').t`Want to add`}</Label>
                <Field>
                    <Radio checked={mode === EMAIL_MODE} onChange={() => setMode(EMAIL_MODE)} className="mr1">{c(
                        'Label'
                    ).t`Email`}</Radio>
                    <Radio checked={mode === DOMAIN_MODE} onChange={() => setMode(DOMAIN_MODE)}>{c('Label')
                        .t`Domain`}</Radio>
                </Field>
            </Row>
            {mode === EMAIL_MODE ? <AddEmailToList email={email} onChange={setEmail} /> : null}
            {mode === DOMAIN_MODE ? <AddDomainToList domain={domain} onChange={setDomain} /> : null}
        </FormModal>
    );
}

AddEmailToListModal.propTypes = {
    type: PropTypes.oneOf(['blacklist', 'whitelist']).isRequired,
    onAdd: PropTypes.func,
    onClose: PropTypes.func
};

export default AddEmailToListModal;
