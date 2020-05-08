import React from 'react';

import { Icon, Tooltip } from 'react-components';

interface Props {
    name: string;
    color: string;
}

const ContactGroupIcon = ({ name, color, ...rest }: Props) => {
    return (
        <Tooltip title={name} {...rest}>
            <Icon name="contacts-groups" color={color} />
        </Tooltip>
    );
};

export default ContactGroupIcon;
