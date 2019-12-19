import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import QRCodeJS from 'qrcodejs2';

const QRCode = ({ url: text, ...rest }) => {
    const divRef = useRef(null);

    useEffect(() => {
        const qrcode = new QRCodeJS(divRef.current, {
            text,
            width: 128,
            height: 128
        });

        return () => {
            qrcode.clear();
        };
    }, []);

    return <div ref={divRef} {...rest} />;
};

QRCode.propTypes = {
    url: PropTypes.string.isRequired
};

export default QRCode;
