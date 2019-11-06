import React, { useContext } from 'react';

const TestIdContext = React.createContext('');

export const useTestId = (id: string | number) => {
    const testId = useContext(TestIdContext);
    return [testId, id].filter(Boolean).join('-');
};

interface Props {
    id: string | number;
    children: React.ReactNode;
}

export const TestId = ({ id, children }: Props) => {
    const testId = useTestId(id);
    return <TestIdContext.Provider value={testId}>{children}</TestIdContext.Provider>;
};

export default TestId;
