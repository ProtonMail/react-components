import React, { useState } from 'react';

import Input from './index';

const Password = ({ ...rest }) => {
    const [type, setType] = useState('password');
    const toggle = () => setType(type === 'password' ? 'text' : 'password');

    return (
        <>
            <Input type={type} {...rest} />
            <button type="button" onClick={toggle}>
                TOGGLE
            </button>
        </>
    );
};

export default Password;
