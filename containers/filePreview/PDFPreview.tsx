import React, { useState, useEffect } from 'react';

interface Props {
    filename?: string;
    contents?: Uint8Array | Uint8Array[];
}
const PDFPreview = ({ filename = 'preview.pdf', contents }: Props) => {
    const [url, setUrl] = useState<string>();

    useEffect(() => {
        if (!contents) {
            return;
        }

        const blob = new Blob(Array.isArray(contents) ? contents : [contents], {
            type: 'application/pdf',
        });
        const newUrl = URL.createObjectURL(blob);
        setUrl(newUrl);
        return () => {
            if (newUrl) {
                URL.revokeObjectURL(newUrl);
            }
        };
    }, [contents]);

    return (
        <>
            {url && (
                <object
                    data={url}
                    className="w100 flex-noMinChildren flex-item-fluid-auto"
                    type="application/pdf"
                    title={filename}
                >
                    <embed src={url} className="flex" type="application/pdf" />
                </object>
            )}
        </>
    );
};

export default PDFPreview;
