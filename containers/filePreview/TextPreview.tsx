import React from 'react';
import { mergeUint8Arrays } from 'proton-shared/lib/helpers/array';

interface Props {
    contents?: Uint8Array | Uint8Array[];
}

const TextPreview = ({ contents = [] }: Props) => {
    const string = new TextDecoder().decode(Array.isArray(contents) ? mergeUint8Arrays(contents) : contents);

    return (
        <div className="pd-file-preview-container">
            <div className="pd-file-preview-text">{string}</div>
        </div>
    );
};

export default TextPreview;
