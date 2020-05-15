import React, { MutableRefObject, useEffect, useState } from 'react';
import { c } from 'ttag';

import { useHandler } from '../../../hooks/useHandler';
import useModals from '../../../containers/modals/useModals';
import Icon from '../../icon/Icon';

import InsertImageModal from '../modals/InsertImageModal';
import InsertLinkModal from '../modals/InsertLinkModal';
import { SquireType, LinkData } from '../squireConfig';
import {
    toggleBold,
    toggleItalic,
    makeLink,
    insertImage,
    getLinkAtCursor,
    toggleUnderline,
    toggleOrderedList,
    toggleUnorderedList,
    toggleBlockquote,
    listenToCursor,
    getPathInfo
} from '../squireActions';
import SquireToolbarButton from './SquireToolbarButton';
import SquireToolbarSeparator from './SquireToolbarSeparator';
import SquireToolbarFontFaceDropdown from './SquireToolbarFontFaceDropdown';
import SquireToolbarFontSizeDropdown from './SquireToolbarFontSizeDropdown';
import SquireToolbarFontColorsDropdown from './SquireToolbarFontColorsDropdown';
import SquireToolbarAlignmentDropdown from './SquireToolbarAlignmentDropdown';
import SquireToolbarMoreDropdown from './SquireToolbarMoreDropdown';
import { EditorMetadata } from '../SquireEditor';

// import { MessageExtended } from '../../../models/message';
// import { isPlainText as testIsPlainText } from '../../../helpers/message/messages';
// import { useHandler } from '../../../hooks/useHandler';
// import { MessageChange } from '../Composer';
// import { Breakpoints } from '../../../models/utils';

interface Props {
    metadata: EditorMetadata;
    onChangeMetadata: (change: Partial<EditorMetadata>) => void;

    // isPlainText: boolean;
    isNarrow: boolean;
    // message: MessageExtended;
    // breakpoints: Breakpoints;
    squireRef: MutableRefObject<SquireType>;
    editorReady: boolean;
    // onChange: MessageChange;
    // onChangeFlag: (changes: Map<number, boolean>) => void;
    onAddImages: (files: File[]) => void;
}

const SquireToolbar = ({
    metadata,
    onChangeMetadata,
    isNarrow,
    squireRef,
    editorReady,
    // onChange,
    // onChangeFlag,
    onAddImages
}: Props) => {
    const [squireInfos, setSquireInfos] = useState<{ [test: string]: boolean }>({});

    const { createModal } = useModals();

    // const isPlainText = testIsPlainText(message.data);

    const handleCursor = useHandler(() => setSquireInfos(getPathInfo(squireRef.current)), { debounce: 500 });

    useEffect(() => listenToCursor(squireRef.current, handleCursor), [editorReady]);

    const handleBold = () => toggleBold(squireRef.current);
    const handleItalic = () => toggleItalic(squireRef.current);
    const handleUnderline = () => toggleUnderline(squireRef.current);
    const handleOrderedList = () => toggleOrderedList(squireRef.current);
    const handleUnorderedList = () => toggleUnorderedList(squireRef.current);
    const handleBlockquote = () => toggleBlockquote(squireRef.current);

    const handleAddLink = (link: LinkData) => {
        makeLink(squireRef.current, link);
    };

    const handleAddImageUrl = (url: string) => {
        insertImage(squireRef.current, url);
    };

    const handleLink = () => {
        const link = getLinkAtCursor(squireRef.current);
        createModal(<InsertLinkModal inputLink={link} onSubmit={handleAddLink} />);
    };

    const handleImage = () => {
        createModal(<InsertImageModal onAddUrl={handleAddImageUrl} onAddImages={onAddImages} />);
    };

    const handleClearFormatting = () => {
        squireRef.current.removeAllFormatting();
    };

    // const { isNarrow } = breakpoints;

    return (
        <div className="editor-toolbar flex flex-nowrap">
            {metadata.isPlainText ? (
                <div className="flex-item-fluid" />
            ) : (
                <>
                    {!isNarrow && (
                        <>
                            <SquireToolbarFontFaceDropdown squireRef={squireRef} editorReady={editorReady} />
                            <SquireToolbarSeparator />
                            <SquireToolbarFontSizeDropdown squireRef={squireRef} editorReady={editorReady} />
                            <SquireToolbarSeparator />
                            <SquireToolbarFontColorsDropdown squireRef={squireRef} editorReady={editorReady} />
                            <SquireToolbarSeparator />
                        </>
                    )}
                    <SquireToolbarButton
                        onClick={handleBold}
                        aria-pressed={squireInfos.bold}
                        className="flex-item-noshrink"
                        title={c('Action').t`Bold`}
                    >
                        <Icon name="text-bold" className="mauto" />
                    </SquireToolbarButton>
                    <SquireToolbarButton
                        onClick={handleItalic}
                        aria-pressed={squireInfos.italic}
                        className="flex-item-noshrink"
                        title={c('Action').t`Italic`}
                    >
                        <Icon name="text-italic" className="mauto" />
                    </SquireToolbarButton>
                    <SquireToolbarButton
                        onClick={handleUnderline}
                        aria-pressed={squireInfos.underline}
                        className="flex-item-noshrink"
                        title={c('Action').t`Underline`}
                    >
                        <Icon name="text-underline" className="mauto" />
                    </SquireToolbarButton>
                    <SquireToolbarSeparator />
                    <SquireToolbarAlignmentDropdown squireRef={squireRef} pathInfos={squireInfos} />
                    <SquireToolbarSeparator />
                    <SquireToolbarButton
                        onClick={handleUnorderedList}
                        aria-pressed={squireInfos.unorderedList}
                        className="flex-item-noshrink"
                        title={c('Action').t`Unordered list`}
                    >
                        <Icon name="bullet-points" className="mauto" />
                    </SquireToolbarButton>
                    <SquireToolbarButton
                        onClick={handleOrderedList}
                        aria-pressed={squireInfos.orderedList}
                        className="flex-item-noshrink"
                        title={c('Action').t`Ordered list`}
                    >
                        <Icon name="ordered-list" className="mauto" />
                    </SquireToolbarButton>
                    <SquireToolbarSeparator />
                    {!isNarrow && (
                        <>
                            <SquireToolbarButton
                                onClick={handleBlockquote}
                                aria-pressed={squireInfos.blockquote}
                                className="flex-item-noshrink"
                                title={c('Action').t`Quote`}
                            >
                                <Icon name="text-quote" className="mauto" />
                            </SquireToolbarButton>
                            <SquireToolbarSeparator />
                        </>
                    )}
                    <SquireToolbarButton
                        onClick={handleLink}
                        className="flex-item-noshrink"
                        title={c('Action').t`Insert link`}
                    >
                        <Icon name="link" className="mauto" />
                    </SquireToolbarButton>
                    <SquireToolbarButton
                        onClick={handleImage}
                        className="flex-item-noshrink"
                        title={c('Action').t`Insert image`}
                    >
                        <Icon name="file-image" className="mauto" />
                    </SquireToolbarButton>
                    <SquireToolbarButton
                        onClick={handleClearFormatting}
                        className="flex-item-noshrink"
                        title={c('Action').t`Clear all formatting`}
                    >
                        <Icon name="remove-text-formatting" className="mauto" />
                    </SquireToolbarButton>
                    <SquireToolbarSeparator />
                </>
            )}
            <SquireToolbarMoreDropdown metadata={metadata} squireRef={squireRef} onChangeMetadata={onChangeMetadata} />
        </div>
    );
};

export default SquireToolbar;
