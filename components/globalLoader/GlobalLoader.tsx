import React, { useContext } from 'react';
import { GlobalLoaderContext } from './GlobalLoaderProvider';

// TODO: Proper styles when design is ready
const GlobalLoader = () => {
    const loaderState = useContext(GlobalLoaderContext);

    const task = loaderState?.tasks[0];

    if (!task) {
        return null;
    }

    return (
        <div
            style={{
                display: 'fixed',
                top: 20,
                left: '50%',
                background: 'red',
            }}
        >
            Loading {task.options.text}
        </div>
    );
};

export default GlobalLoader;
