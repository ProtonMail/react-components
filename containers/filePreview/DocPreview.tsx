import React, { useState, useEffect } from 'react';
import mammoth from 'mammoth';
import { mergeUint8Arrays } from 'proton-shared/lib/helpers/array';

interface Props {
    contents?: Uint8Array[];
}
const DocPreview = ({ contents }: Props) => {
    const [htmlContentString, setHtml] = useState('');

    useEffect(() => {
        if (!contents) {
            return;
        }

        const contentBuffer = mergeUint8Arrays(contents).buffer;
        mammoth.convertToHtml({ arrayBuffer: contentBuffer }).then((result: any) => {
            setHtml(result.value);
        });
    }, [contents]);

    const content = <div dangerouslySetInnerHTML={{ __html: htmlContentString }} />;

    return (
        <div className="pd-file-preview-container">
            <div className="pd-file-preview-text">{content}</div>
        </div>
    );
};

export default DocPreview;
