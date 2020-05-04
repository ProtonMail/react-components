import React from 'react';

interface Props {
    contactID?: string;
}

const ImportContactModal = ({ contactID }: Props) => {
    const editModeOn = !!contactID;

    return <div>{editModeOn ? `Editing contact ${contactID}` : 'Create new contact'}</div>;
};

export default ImportContactModal;
