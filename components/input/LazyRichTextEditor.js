import React, { lazy, Suspense } from 'react';
import { Loader } from 'react-components';

// lazy load RichTextEditor component to avoid loading unnecessary css styles
const LazyRichTextEditor = lazy(() => import('./RichTextEditor'));

// we need to suspend, otherwise the app will crash while loading
const SuspendedLazyRichTextEditor = (props) => {
    return (
        <Suspense fallback={<Loader />}>
            <LazyRichTextEditor {...props} />
        </Suspense>
    );
};

export default SuspendedLazyRichTextEditor;
