import React, { MutableRefObject, ReactNode } from 'react';
import { c } from 'ttag';
import { RIGHT_TO_LEFT } from 'proton-shared/lib/constants';

import DropdownMenu from '../../dropdown/DropdownMenu';
import DropdownMenuButton from '../../dropdown/DropdownMenuButton';
import Icon from '../../icon/Icon';
import { classnames } from '../../../helpers/component';

import SquireToolbarDropdown from './SquireToolbarDropdown';
import { SquireType } from '../squireConfig';
import { setTextDirection } from '../squireActions';
import { EditorMetadata } from '../SquireEditor';

const getClassname = (status: boolean) => (status ? undefined : 'nonvisible');

interface Props {
    metadata: EditorMetadata;
    onChangeMetadata: (change: Partial<EditorMetadata>) => void;
    squireRef: MutableRefObject<SquireType>;
    extension?: ReactNode;
}

const SquireToolbarMoreDropdown = ({ metadata, squireRef, onChangeMetadata, extension }: Props) => {
    // const [mailSettings] = useMailSettings() as [MailSettings, boolean, Error];
    // const [addresses] = useAddresses() as [Address[], boolean, Error];

    const isRTL = metadata.RightToLeft === RIGHT_TO_LEFT.ON;
    const isPlainText = metadata.isPlainText;

    const handleChangeDirection = (RightToLeft: RIGHT_TO_LEFT) => () => {
        // onChange({ data: { RightToLeft } });

        onChangeMetadata({ RightToLeft });
        // setTimeout prevent a race condition between change of the flag and the content
        setTimeout(() => setTextDirection(squireRef.current, RightToLeft));
    };

    const switchToPlainText = () => {
        // const MIMEType = MIME_TYPES.PLAINTEXT;
        // const plainText = exportPlainText(message);
        // onChange(plainText);

        onChangeMetadata({ isPlainText: true });

        // const embeddeds = createEmbeddedMap();
        // onChange({ plainText, data: { MIMEType }, embeddeds });
    };

    const switchToHTML = () => {
        // const MIMEType = MIME_TYPES.DEFAULT;
        // const content = plainTextToHTML(message, mailSettings, addresses);
        // const document = setDocumentContent(message.document, content);
        // onChange({ document, data: { MIMEType } });

        onChangeMetadata({ isPlainText: false });
    };

    const handleChangePlainText = (newIsPlainText: boolean) => () => {
        if (metadata.isPlainText !== newIsPlainText) {
            if (newIsPlainText) {
                switchToPlainText();
            } else {
                switchToHTML();
            }
        }
    };

    return (
        <SquireToolbarDropdown className="flex-item-noshrink mlauto" title={c('Action').t`More`}>
            <DropdownMenu className="editor-toolbar-more-menu flex-item-noshrink">
                {!metadata.isPlainText && [
                    // Fragment breaks the DropdownMenu flow, an array works
                    <DropdownMenuButton
                        key={1}
                        className="alignleft flex flex-nowrap"
                        onClick={handleChangeDirection(RIGHT_TO_LEFT.OFF)}
                    >
                        <Icon name="on" className={classnames(['mt0-25', getClassname(!isRTL)])} />
                        <span className="ml0-5 mtauto mbauto flex-item-fluid">{c('Info').t`Left to Right`}</span>
                    </DropdownMenuButton>,
                    <DropdownMenuButton
                        key={2}
                        className="alignleft flex flex-nowrap"
                        onClick={handleChangeDirection(RIGHT_TO_LEFT.ON)}
                    >
                        <Icon name="on" className={classnames(['mt0-25', getClassname(isRTL)])} />
                        <span className="ml0-5 mtauto mbauto flex-item-fluid">{c('Info').t`Right to Left`}</span>
                    </DropdownMenuButton>
                ]}
                <DropdownMenuButton
                    className="alignleft flex flex-nowrap noborder-bottom"
                    onClick={handleChangePlainText(false)}
                >
                    <Icon name="on" className={classnames(['mt0-25', getClassname(!isPlainText)])} />
                    <span className="ml0-5 mtauto mbauto flex-item-fluid">{c('Info').t`Normal`}</span>
                </DropdownMenuButton>
                <DropdownMenuButton className="alignleft flex flex-nowrap" onClick={handleChangePlainText(true)}>
                    <Icon name="on" className={classnames(['mt0-25', getClassname(isPlainText)])} />
                    <span className="ml0-5 mtauto mbauto flex-item-fluid">{c('Info').t`Plain text`}</span>
                </DropdownMenuButton>
                {extension}
            </DropdownMenu>
        </SquireToolbarDropdown>
    );
};

export default SquireToolbarMoreDropdown;
