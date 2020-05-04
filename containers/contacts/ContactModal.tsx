import React from 'react';

import { FormModal } from 'react-components';

interface Props {
    contactID?: string;
}

const ContactModal = ({ contactID, ...rest }: Props) => {
    const editModeOn = !!contactID;

    return (
        <FormModal title={editModeOn ? `Editing contact ${contactID}` : 'Create new contact'} {...rest}>
            hello
        </FormModal>
    );
};

export default ContactModal;
