import { useContext, useRef } from 'react';
import { GlobalLoaderContext, TaskOptions, Task } from './GlobalLoaderProvider';

type WithGlobalLoading = <T>(promise: Promise<T>) => Promise<T>;

function useGlobalLoader(options: TaskOptions = {}): [WithGlobalLoading, boolean] {
    const taskRef = useRef<Task>();
    const state = useContext(GlobalLoaderContext);

    if (!state) {
        throw new Error('Trying to use uninitialized GlobalLoaderContext');
    }

    const withGlobalLoader = <T>(promise: Promise<T>) => {
        const [task, taskPromise] = state.addPendingTask(promise, options);
        taskRef.current = task;
        return taskPromise;
    };

    const isLoading = !!taskRef.current && state.tasks.includes(taskRef.current);

    return [withGlobalLoader, isLoading];
}

export default useGlobalLoader;
