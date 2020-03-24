import { useState } from 'react';

const toModel = ({ Self, addresses = [] }, domain = '') => {
    const [{ DisplayName } = {}] = addresses;
    return {
        name: Self ? DisplayName || '' : '', // DisplayName can be null
        address: '',
        domain
    };
};

const useAddressModal = (member, domainName) => {
    const initialModel = toModel(member, domainName);
    const [model, updateModel] = useState(initialModel);
    const update = (key, value) => updateModel({ ...model, [key]: value });

    return {
        model,
        update
    };
};

export default useAddressModal;
