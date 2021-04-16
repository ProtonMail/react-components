import React from 'react';
import { c } from 'ttag';
import { FormModal, Href } from '../../components';

interface Props {
    message?: string;
}

const AbuseModal = ({ message, ...rest }: Props) => {
    const title = c('Title').t`Account disabled`;

    const abuseOrFraudLink = (
        <Href url="https://protonmail.com/support/knowledge-base/account-disabled/" key={0}>
            {c('Info').t`abuse or fraud`}
        </Href>
    );

    const contactLink = (
        <Href url="https://protonmail.com/abuse" key={1}>
            {c('Info').t`here`}
        </Href>
    );

    return (
        <FormModal hasClose={false} hasSubmit={false} title={title} small close={c('Action').t`Close`} {...rest}>
            {message || (
                <>
                    <div className="mb1">{c('Info').jt`Account disabled due to ${abuseOrFraudLink}.`}</div>
                    <div>{c('Info').jt`You can find more information and contact us ${contactLink}.`}</div>
                </>
            )}
        </FormModal>
    );
};

export default AbuseModal;
