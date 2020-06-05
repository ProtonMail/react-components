import React, { useRef, useState, useEffect } from 'react';
import { c } from 'ttag';

import { classnames, Toggle, SimpleSquireEditor } from 'react-components';

import { SquireEditorRef } from '../../../components/editor/SquireEditor';
import { Actions } from './interfaces';

interface Props {
    isNarrow: boolean;
    actions: Actions;
    handleUpdateActions: (onUpdateActions: Partial<Actions>) => void;
}

const FilterActionsFormAutoReplyRow = ({ isNarrow, actions, handleUpdateActions }: Props) => {
    const editorRef = useRef<SquireEditorRef>(null);
    const { autoReply } = actions;
    const [editorVisible, setEditorVisible] = useState(false);
    const [editorValue, setEditorValue] = useState(autoReply);

    const handleReady = () => {
        if (editorRef.current) {
            editorRef.current.value = editorValue;
            editorRef.current.focus();
        }
    };

    useEffect(() => {
        handleUpdateActions({ autoReply: editorVisible ? editorValue : '' });
    }, [editorVisible]);

    return (
        <div className="flex flex-nowrap onmobile-flex-column align-items-center pt1 pb1">
            <label htmlFor="autoReply" className={classnames(['w25 pt0-5', isNarrow && 'mb1'])}>
                <span className="ml0-5 mr0-5">{c('Label').t`Send auto-reply`}</span>
            </label>
            <div className="ml0-5 flex flex-column flex-item-fluid">
                <Toggle
                    id="autoReply"
                    checked={editorVisible}
                    onChange={() => {
                        setEditorVisible((editorVisible) => !editorVisible);
                    }}
                />
                {editorVisible && (
                    <div className="w100 mt1">
                        <SimpleSquireEditor
                            ref={editorRef}
                            onReady={handleReady}
                            onChange={(value: string) => {
                                setEditorValue(value);
                                handleUpdateActions({ autoReply: value });
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterActionsFormAutoReplyRow;
