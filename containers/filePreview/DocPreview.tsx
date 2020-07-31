import React, { useState, useEffect } from 'react';

interface Props {
    filename?: string;
    contents?: Uint8Array[];
}
const DocPreview = ({ filename = 'preview.pdf', contents }: Props) => {
    const [url, setUrl] = useState<string>();

    useEffect(() => {
        const newUrl = URL.createObjectURL(
            new Blob(contents, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
        );
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
                    className="w100 flex flex-item-fluid flex-justify-center flex-items-center"
                    type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    title={filename}
                >
                    <embed
                        src={url}
                        className="flex"
                        type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    />
                </object>
            )}
        </>
    );
};

export default DocPreview;
