import { useState } from 'react';

import { getErrors } from '../lib/cardValidator';
import getDefaultCard from '../lib/getDefaultCard';

const useCard = (initialCard = getDefaultCard()) => {
    const [card, update] = useState(initialCard);
    const updateCard = (key, value) => update({ ...card, [key]: value });
    const errors = getErrors(card);
    const isValid = !Object.keys(errors).length;

    return {
        card,
        updateCard,
        errors,
        isValid
    };
};

export default useCard;
