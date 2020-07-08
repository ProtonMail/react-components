import React, { useEffect, useContext } from 'react';

const PreventLeaveContext = React.createContext({ pendingTasks: new Set<Promise<any>>() });

export default function usePreventLeave() {
    const { pendingTasks } = useContext(PreventLeaveContext);

    function preventLeave<T>(task: Promise<T>) {
        pendingTasks.add(task);
        const cleanup = () => pendingTasks.delete(task);
        task.then(cleanup).catch(cleanup);
        return task;
    }

    return { preventLeave };
}

export const PreventLeaveProvider = ({ children }: { children: React.ReactNode }) => {
    const { pendingTasks } = useContext(PreventLeaveContext);

    useEffect(() => {
        const unloadCallback = (e: BeforeUnloadEvent) => {
            if (pendingTasks.size) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };

        window.addEventListener('beforeunload', unloadCallback);

        return () => {
            window.removeEventListener('beforeunload', unloadCallback);
        };
    }, [pendingTasks]);

    return children;
};
