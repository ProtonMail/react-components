import React, { useRef, useState, useEffect, forwardRef, Ref } from 'react';
import { c } from 'ttag';

import { useHandler } from '../../hooks/useHandler';
import { SquireType, getSquireRef, setSquireRef, initSquire } from './squireConfig';
import { pasteFileHandler } from './squireActions';

const isHTMLEmpty = (html: string) => !html || html === '<div><br /></div>' || html === '<div><br></div>';

// import { findCIDsInContent } from '../../../helpers/embedded/embeddedFinder';
// import { Attachment } from '../../../models/attachment';
// import { MessageExtended } from '../../../models/message';
// import { getDocumentContent } from '../../../helpers/message/messageContent';
// import { isHTMLEmpty } from '../../../helpers/dom';

interface Props {
    // message: MessageExtended;
    // value: string;
    onReady: () => void;
    onFocus: () => void;
    onInput: (value: string) => void;
    onAddImages: (files: File[]) => void;
    // onRemoveAttachment: (attachment: Attachment) => () => void;
}

/**
 * This component is *Uncontrolled*
 * https://reactjs.org/docs/uncontrolled-components.html
 * There is issues when trying to synchronize input value to the current content of the editor
 * Uncontrolled components is prefered in this case
 */
const SquireIframe = forwardRef(({ onReady, onFocus, onInput, onAddImages }: Props, ref: Ref<SquireType>) => {
    const [iframeReady, setIframeReady] = useState(false);
    const [squireReady, setSquireReady] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);

    // Keep track of the containing CIDs to detect deletion
    // const [cids, setCIDs] = useState<string[]>([]);

    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const handleLoad = () => setIframeReady(true);

        const iframeDoc =
            (iframeRef.current?.contentDocument || iframeRef.current?.contentWindow) &&
            iframeRef.current?.contentWindow?.document;

        if (iframeDoc && iframeDoc.readyState === 'complete') {
            handleLoad();
        }

        iframeRef.current?.addEventListener('load', handleLoad);
        return () => iframeRef.current?.removeEventListener('load', handleLoad);
    }, []);

    useEffect(() => {
        if (iframeReady && !squireReady) {
            const iframeDoc = iframeRef.current?.contentWindow?.document as Document;

            const squire = initSquire(iframeDoc);
            setSquireRef(ref, squire);
            setSquireReady(true);
            onReady();
        }
    }, [iframeReady]);

    // Angular/src/app/squire/services/removeInlineWatcher.js
    // const checkImageDeletion = useHandler(
    //     () => {
    //         const newCIDs = findCIDsInContent(getSquireRef(ref).getHTML());
    //         const removedCIDs = diff(cids, newCIDs);
    //         removedCIDs.forEach((cid) => {
    //             const info = message.embeddeds?.get(cid);
    //             if (info) {
    //                 onRemoveAttachment(info.attachment)();
    //             }
    //         });
    //         setCIDs(newCIDs);
    //     },
    //     { debounce: 500 }
    // );

    const handleFocus = useHandler(() => {
        onFocus();
        // A bit artificial but will trigger "autoCloseOutside" from all dropdowns
        document.dispatchEvent(new CustomEvent('dropdownclose'));
    });
    const handleInput = useHandler(() => {
        // checkImageDeletion();
        const content = getSquireRef(ref).getHTML();
        setIsEmpty(isHTMLEmpty(content));
        onInput(content);
    });
    const handlePaste = useHandler(pasteFileHandler(onAddImages));

    useEffect(() => {
        if (squireReady) {
            const squire = getSquireRef(ref);

            squire.addEventListener('focus', handleFocus);
            squire.addEventListener('input', handleInput);
            squire.addEventListener('paste', handlePaste);
            return () => {
                squire.removeEventListener('focus', handleFocus);
                squire.removeEventListener('input', handleInput);
                squire.removeEventListener('paste', handlePaste);
            };
        }
    }, [squireReady]);

    return (
        <div className="editor-squire-wrapper fill w100 scroll-if-needed flex-item-fluid rounded relative">
            {isEmpty && (
                <div className="absolute ml1 no-pointer-events placeholder">{c('Placeholder')
                    .t`Write your message`}</div>
            )}
            <iframe ref={iframeRef} frameBorder="0" className="w100 h100 squireIframe"></iframe>
        </div>
    );
});

export default SquireIframe;
