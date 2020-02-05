import React from 'react';
import ReactQuill from 'react-quill';
import Quill from 'quill';

const Block = Quill.import('blots/block');
Block.tagName = 'div';
Quill.register(Block);

const RichTextEditor = ({ ...rest }) => {
    // This style will be lazy loaded by LazyRichTextEditor
    import('design-system/_sass/react-styles/quill/_snow.scss');

    return <ReactQuill {...rest} />;
};

export default RichTextEditor;
