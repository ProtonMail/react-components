import React, { createContext, useState, ReactNode, useContext, useMemo } from 'react';

const FocusAreaContext = createContext<{
    focusArea: string;
    changeFocusArea: (value: string) => void;
} | null>(null);

const useFocusArea = () => useContext(FocusAreaContext);

export const FocusAreaProvider = ({ children }: { children: ReactNode }) => {
    const [focusArea, setFocusArea] = useState('');

    const changeFocusArea = (value: string) => setFocusArea(value);

    const value = useMemo(
        () => ({
            focusArea,
            changeFocusArea,
        }),
        [focusArea, changeFocusArea]
    );
    return <FocusAreaContext.Provider value={value}>{children}</FocusAreaContext.Provider>;
};

export default useFocusArea;
