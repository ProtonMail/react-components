import React, { useEffect, useState } from 'react';
import XLSX from 'xlsx';

import { mergeUint8Arrays } from 'proton-shared/lib/helpers/array';
import { input } from 'proton-shared/lib/sanitize/purify';

interface Props {
    filename?: string;
    contents?: Uint8Array[];
}

const ExcelPreview = ({ filename, contents }: Props) => {
    const [htmlContentString, setHtml] = useState('');

    useEffect(() => {
        if (!contents) {
            return;
        }

        const data = mergeUint8Arrays(contents);
        const wb = XLSX.read(data, { type: 'array' });
        const htmlStr = XLSX.write(wb, { sheet: filename, type: 'binary', bookType: 'html' });
        setHtml(input(htmlStr));
    }, [contents]);

    const content = <div dangerouslySetInnerHTML={{ __html: htmlContentString }} />;

    return (
        <div className="pd-file-preview-container">
            <div className="pd-file-preview-text" style={{ border: '1px solid black' }}>
                {content}
            </div>
        </div>
    );
};

export default ExcelPreview;
