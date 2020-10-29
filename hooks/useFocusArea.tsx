import React, { createContext, useState, useContext } from 'react';
import { noop } from 'proton-shared/lib/helpers/function';

const FocusAreaContext = createContext<[string, Function]>(['', noop]);

const useFocusArea = () => useContext(FocusAreaContext);

interface Props {
    children?: React.ReactNode;
}

export const FocusAreaProvider = ({ children }: Props) => {
    const [focusArea, setFocusArea] = useState('');

    return <FocusAreaContext.Provider value={[focusArea, setFocusArea]}>{children}</FocusAreaContext.Provider>;
};

export default useFocusArea;
