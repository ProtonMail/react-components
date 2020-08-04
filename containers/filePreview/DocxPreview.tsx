import React, { useState, useEffect } from 'react';
import { convertToHtml } from 'mammoth';
import { mergeUint8Arrays } from 'proton-shared/lib/helpers/array';
import { input } from 'proton-shared/lib/sanitize/purify';

interface Props {
    contents?: Uint8Array[];
}
const DocxPreview = ({ contents }: Props) => {
    const [htmlContentString, setHtml] = useState('');

    useEffect(() => {
        if (!contents) {
            return;
        }

        const contentBuffer = mergeUint8Arrays(contents).buffer;
        convertToHtml({ arrayBuffer: contentBuffer }).then((result: any) => {
            setHtml(input(result.value));
        });
    }, [contents]);

    const content = <div dangerouslySetInnerHTML={{ __html: htmlContentString }} />;

    return (
        <div className="pd-file-preview-container">
            <div className="pd-file-preview-text">{content}</div>
        </div>
    );
};

export default DocxPreview;
