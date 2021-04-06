import React from 'react';

interface Props {
    onClose: () => void;
}

const ContactsWidgetSettingsContainer = ({ onClose }: Props) => {
    return (
        <>
            <button type="button" onClick={() => onClose()}>
                Close widget
            </button>
        </>
    );
};

export default ContactsWidgetSettingsContainer;
