import React, {
    MutableRefObject,
    useRef,
    useEffect,
    useState,
    ChangeEvent,
    MouseEventHandler,
    forwardRef,
    Ref,
    ReactNode
} from 'react';
import { c } from 'ttag';
import { RIGHT_TO_LEFT } from 'proton-shared/lib/constants';
import { noop } from 'proton-shared/lib/helpers/function';

import { Button } from '../button';
import { classnames } from '../../helpers/component';

import EditorToolbar from './toolbar/SquireToolbar';
import SquireIframe from './SquireIframe';
import { SquireType } from './squireConfig';
import { setTextDirectionWithoutFocus, insertImage } from './squireActions';

export interface SquireEditorMetadata {
    isPlainText: boolean;
    RightToLeft: RIGHT_TO_LEFT;
}

export interface SquireEditorRef {
    focus: () => void;
    value: string;
    document?: Element;
    insertImage: (url: string, attrs: { [key: string]: string | undefined }) => void;
}

interface Props {
    metadata: SquireEditorMetadata;
    onChange: (value: string) => void;
    onChangeMetadata: (metadataChange: Partial<SquireEditorMetadata>) => void;
    isNarrow?: boolean;
    showEllipseButton?: boolean;
    onEllipseClick?: MouseEventHandler;
    disabled: boolean;
    onReady: () => void;
    onFocus: () => void;
    onAddImages: (files: File[]) => void;
    toolbarMoreDropdownExtension: ReactNode;
}

const SquireEditor = forwardRef(
    (
        {
            metadata,
            onChange,
            onChangeMetadata,
            isNarrow = false,
            showEllipseButton = false,
            onEllipseClick = noop,
            disabled,
            onReady,
            onFocus,
            onAddImages,
            toolbarMoreDropdownExtension
        }: Props,
        ref: Ref<SquireEditorRef>
    ) => {
        const [editorReady, setEditorReady] = useState(false);

        const squireRef = useRef<SquireType>(null) as MutableRefObject<SquireType>;
        const textareaRef = useRef<HTMLTextAreaElement>(null);

        useEffect(() => {
            const mutableRef = ref as MutableRefObject<SquireEditorRef>;
            mutableRef.current = {
                get value() {
                    if (metadata.isPlainText) {
                        return textareaRef.current?.value || '';
                    } else {
                        return squireRef.current?.getHTML() || '';
                    }
                },
                set value(value: string) {
                    if (metadata.isPlainText) {
                        textareaRef.current && (textareaRef.current.value = value);
                    } else {
                        squireRef.current?.setHTML(value);
                        setTextDirectionWithoutFocus(squireRef.current, metadata.RightToLeft || RIGHT_TO_LEFT.OFF);
                        squireRef.current?.fireEvent('input'); // For Squire to be aware of the change
                    }
                },
                get document() {
                    if (metadata.isPlainText) {
                        return undefined;
                    } else {
                        return (squireRef.current.getDocument() as any) as Element;
                    }
                },
                focus: () => {
                    if (metadata.isPlainText) {
                        textareaRef.current?.focus();
                    } else {
                        squireRef.current?.focus();
                    }
                },
                insertImage: (url: string, attrs: { [key: string]: string | undefined }) => {
                    insertImage(squireRef.current, url, attrs);
                }
            };
        }, []);

        useEffect(() => {
            if (metadata.isPlainText) {
                onReady();
                setEditorReady(false);
            }
        }, [editorReady, metadata.isPlainText]);

        const handleReady = () => {
            onReady();
            setEditorReady(true);
        };

        const handlePlainTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
            onChange(event.target.value);
        };

        return (
            <div className={classnames(['editor w100 h100 rounded flex flex-column', disabled && 'editor--disabled'])}>
                <EditorToolbar
                    metadata={metadata}
                    onChangeMetadata={onChangeMetadata}
                    squireRef={squireRef}
                    isNarrow={isNarrow}
                    editorReady={editorReady}
                    onAddImages={onAddImages}
                    moreDropdownExtension={toolbarMoreDropdownExtension}
                />
                {metadata.isPlainText ? (
                    <textarea
                        className="w100 h100 flex-item-fluid pt1 pb1 pl0-5 pr0-5"
                        ref={textareaRef}
                        onFocus={onFocus}
                        onChange={handlePlainTextChange}
                        placeholder={c('Placeholder').t`Write your message`}
                    />
                ) : (
                    <>
                        <SquireIframe
                            ref={squireRef}
                            // value={value}
                            onFocus={onFocus}
                            onReady={handleReady}
                            onInput={onChange}
                            onAddImages={onAddImages}
                            // onRemoveAttachment={onRemoveAttachment}
                        />
                        {showEllipseButton && (
                            <div className="m0-5">
                                <Button className="pm-button--small" onClick={onEllipseClick}>
                                    ...
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }
);

export default SquireEditor;
