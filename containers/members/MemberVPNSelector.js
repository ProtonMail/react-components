import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'react-components';
import { range } from 'proton-shared/lib/helpers/array';

const MemberVPNSelector = ({ member = {}, organization, onChange }) => {
    const minPadding = 0;
    const maxPadding = organization.MaxVPN - organization.UsedVPN;
    const options = range(minPadding, maxPadding).map((value) => ({ text: value, value }));
    const [vpn, setVpn] = useState(member.ID ? member.MaxVPN : 1);
    const handleChange = ({ target }) => setVpn(target.value);

    useEffect(() => {
        onChange(vpn);
    }, [vpn]);

    return <Select value={vpn} options={options} onChange={handleChange} />;
};

MemberVPNSelector.propTypes = {
    member: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    organization: PropTypes.object.isRequired
};

export default MemberVPNSelector;
