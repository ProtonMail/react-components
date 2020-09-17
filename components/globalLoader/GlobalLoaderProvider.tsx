import React, { createContext, useReducer } from 'react';

export interface TaskOptions {
    text?: string;
}

export interface Task {
    promise: Promise<any>;
    options: TaskOptions;
}

type Action = { type: 'addPendingTask'; payload: Task } | { type: 'resolvePendingTask'; payload: Task };

const reducer = (state: Task[], action: Action) => {
    switch (action.type) {
        case 'addPendingTask':
            return [...state, action.payload];
        case 'resolvePendingTask':
            return state.filter((task) => task !== action.payload);
    }
};

const useGlobalLoaderProvider = () => {
    const [tasks, dispatch] = useReducer(reducer, []);

    const addPendingTask = <T,>(promise: Promise<T>, options: TaskOptions): [Promise<T>, Task] => {
        const task = { options, promise };
        dispatch({ type: 'addPendingTask', payload: task });
        return [
            promise.finally(() => {
                dispatch({ type: 'resolvePendingTask', payload: task });
            }),
            task,
        ];
    };

    return {
        tasks,
        addPendingTask,
    };
};

export const GlobalLoaderContext = createContext<ReturnType<typeof useGlobalLoaderProvider> | null>(null);

interface Props {
    children: React.ReactNode;
}

const GlobalLoaderProvider = ({ children }: Props) => {
    const state = useGlobalLoaderProvider();

    return <GlobalLoaderContext.Provider value={state}>{children}</GlobalLoaderContext.Provider>;
};

export default GlobalLoaderProvider;
