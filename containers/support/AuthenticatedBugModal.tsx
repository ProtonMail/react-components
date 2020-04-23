import React from 'react';

import { useUser, useAddresses } from '../..';
import BugModal from './BugModal';

const AuthenticatedBugModal = ({ ...rest }) => {
    const [{ Name = '' }] = useUser();
    const [addresses = []] = useAddresses();
    return <BugModal username={Name} addresses={addresses} {...rest} />;
};

export default AuthenticatedBugModal;
