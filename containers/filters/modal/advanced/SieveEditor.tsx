import React from 'react';
import codemirror from 'codemirror';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/lint/lint';
import 'codemirror/mode/sieve/sieve';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/theme/base16-dark.css';

interface Props {
    value: string;
    onChange: (editor: codemirror.Editor, data: codemirror.EditorChange, value: string) => void;
    theme?: string;
}

const SieveEditor = ({ value, onChange, theme }: Props) => {
    const options = {
        mode: 'sieve',
        lineNumbers: true,
        lineWrapping: true,
        readOnly: false,
        fixedGutter: false,
        spellcheck: false,
        gutters: ['CodeMirror-lint-markers'],
        autoRefresh: true,
        ...(theme ? { theme } : {})
    };

    return <CodeMirror className="bordered-container" value={value} options={options} onChange={onChange} />;
};

export default SieveEditor;
