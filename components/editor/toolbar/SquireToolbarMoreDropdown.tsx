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
import { SquireEditorMetadata } from '../SquireEditor';

const getClassname = (status: boolean) => (status ? undefined : 'nonvisible');

interface Props {
    metadata: SquireEditorMetadata;
    onChangeMetadata: (change: Partial<SquireEditorMetadata>) => void;
    squireRef: MutableRefObject<SquireType>;
    children?: ReactNode;
}

const SquireToolbarMoreDropdown = ({ metadata, squireRef, onChangeMetadata, children }: Props) => {
    const isRTL = metadata.rightToLeft === RIGHT_TO_LEFT.ON;
    const isPlainText = metadata.isPlainText;

    const handleChangeDirection = (rightToLeft: RIGHT_TO_LEFT) => () => {
        onChangeMetadata({ rightToLeft });
        setTimeout(() => setTextDirection(squireRef.current, rightToLeft));
    };

    const switchToPlainText = () => {
        onChangeMetadata({ isPlainText: true });
    };

    const switchToHTML = () => {
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
                {metadata.supportRightToLeft &&
                    !metadata.isPlainText && [
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
                {metadata.supportPlainText && [
                    <DropdownMenuButton
                        key={3}
                        className="alignleft flex flex-nowrap noborder-bottom"
                        onClick={handleChangePlainText(false)}
                    >
                        <Icon name="on" className={classnames(['mt0-25', getClassname(!isPlainText)])} />
                        <span className="ml0-5 mtauto mbauto flex-item-fluid">{c('Info').t`Normal`}</span>
                    </DropdownMenuButton>,
                    <DropdownMenuButton
                        key={4}
                        className="alignleft flex flex-nowrap"
                        onClick={handleChangePlainText(true)}
                    >
                        <Icon name="on" className={classnames(['mt0-25', getClassname(isPlainText)])} />
                        <span className="ml0-5 mtauto mbauto flex-item-fluid">{c('Info').t`Plain text`}</span>
                    </DropdownMenuButton>
                ]}
                {children}
            </DropdownMenu>
        </SquireToolbarDropdown>
    );
};

export default SquireToolbarMoreDropdown;
