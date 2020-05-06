import React from 'react';

import { FormModal } from 'react-components';

interface Props {
    contactID?: string;
}

const ContactModal = ({ contactID, ...rest }: Props) => {
    const editModeOn = !!contactID;

    return (
        <FormModal title={editModeOn ? `Contact details` : 'Create contact'} {...rest}>
            👋
        </FormModal>
    );
};

export default ContactModal;
