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

// interface ExternalEditorActions {
//     insertEmbedded: (embeddeds: EmbeddedMap) => void;
//     removeEmbedded: (attachments: Attachment[]) => void;
// }

// export type EditorActionsRef = MutableRefObject<ExternalEditorActions | undefined>;

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
    // message: MessageExtended;
    // document?: Element;

    // input values
    // value: string;
    metadata: SquireEditorMetadata;

    // change listener
    onChange: (value: string) => void;
    onChangeMetadata: (metadataChange: Partial<SquireEditorMetadata>) => void;

    // responsive
    isNarrow?: boolean;

    // ellipse system (for blockquote)
    showEllipseButton?: boolean;
    onEllipseClick?: MouseEventHandler;

    // plaintext support utilities
    // htmlToText?: (html: string) => string;
    // textToHtml?: (text: string) => string;

    disabled: boolean;
    // breakpoints: Breakpoints;
    onReady: () => void;
    // onChange: MessageChange;
    // onChangeContent: (content: string) => void;
    // onChangeFlag: (changes: Map<number, boolean>) => void;
    onFocus: () => void;
    onAddImages: (files: File[]) => void;
    // onAddEmbeddedImages: (files: File[]) => void;
    // onRemoveAttachment: (attachment: Attachment) => () => void;
    // contentFocusRef: MutableRefObject<() => void>;
    // editorActionsRef: EditorActionsRef;
    toolbarMoreDropdownExtension: ReactNode;
}

const SquireEditor = forwardRef(
    (
        {
            // message,
            // value,
            metadata,

            onChange,
            onChangeMetadata,

            isNarrow = false,

            showEllipseButton = false,
            onEllipseClick = noop,

            disabled,
            // breakpoints,
            onReady,
            // onChange,
            // onChangeContent,
            // onChangeFlag,
            onFocus,
            // onAddAttachments,
            onAddImages,
            toolbarMoreDropdownExtension
        }: // onRemoveAttachment,
        // contentFocusRef
        // editorActionsRef
        Props,
        ref: Ref<SquireEditorRef>
    ) => {
        // const isPlainText = testIsPlainText(message.data);

        const [editorReady, setEditorReady] = useState(false);
        // const [documentReady, setDocumentReady] = useState(false);
        // const [blockquoteExpanded, setBlockquoteExpanded] = useState(true);
        // const [blockquoteSaved, setBlockquoteSaved] = useState('');

        const squireRef = useRef<SquireType>(null) as MutableRefObject<SquireType>;
        const textareaRef = useRef<HTMLTextAreaElement>(null);

        // useEffect(() => {
        //     if (message.document?.innerHTML) {
        //         setDocumentReady(true);
        //     }
        // }, [message.document?.innerHTML]);

        // Initialize Squire (or textarea) content at (and only) startup
        // useEffect(() => {
        //     if (isPlainText) {
        //         setEditorReady(false);
        //     }

        //     if (documentReady) {
        //         if (isPlainText) {
        //             if (textareaRef.current) {
        //                 const content = getContent(message);
        //                 textareaRef.current.value = content;
        //                 setTextAreaCursorStart(textareaRef.current);

        //                 contentFocusRef.current = textareaRef.current?.focus.bind(squireRef.current);
        //             }
        //         } else {
        //             if (editorReady) {
        //                 const [content, blockquote] = locateBlockquote(message.document);
        //                 setBlockquoteSaved(blockquote);
        //                 setBlockquoteExpanded(blockquote === '');

        //                 squireRef.current?.setHTML(content);
        //                 setTextDirectionWithoutFocus(
        //                     squireRef.current,
        //                     message.data?.RightToLeft?.valueOf() || RIGHT_TO_LEFT.OFF
        //                 );

        //                 contentFocusRef.current = squireRef.current?.focus.bind(squireRef.current);
        //             }
        //         }
        //         onReady();
        //     }
        // }, [editorReady, documentReady, isPlainText]);

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
                // contentFocusRef.current = () => textareaRef.current?.focus();
            } else {
                // contentFocusRef.current = () => squireRef.current?.focus();
            }
        }, [editorReady, metadata.isPlainText]);

        const handleReady = () => {
            onReady();
            setEditorReady(true);
        };

        // const handleInput = (content: string) => {
        //     if (!blockquoteExpanded) {
        //         onChangeContent(content + blockquoteSaved);
        //     } else {
        //         onChangeContent(content);
        //     }
        // };

        // const handleShowBlockquote = () => {
        //     setBlockquoteExpanded(true);
        //     const content = squireRef.current.getHTML();
        //     squireRef.current.setHTML(content + blockquoteSaved);
        // };

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
                        {!showEllipseButton && (
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
