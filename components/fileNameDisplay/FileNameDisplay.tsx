import React from 'react';
import { splitExtension } from 'proton-shared/lib/helpers/file';
import { MiddleEllipsis } from '../ellipsis';

const CHARACTERS_BEFORE_EXTENSION = 3;

interface Props {
    text: string;
}

const FileNameDisplay = ({ text = '' }: Props) => {
    const fileDetails = splitExtension(text);
    const extensionOffset = fileDetails[1].length + CHARACTERS_BEFORE_EXTENSION;

    return <MiddleEllipsis charsToDisplayEnd={extensionOffset} className="center" text={text} />;
};

export default FileNameDisplay;
