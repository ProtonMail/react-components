import React, { MutableRefObject } from 'react';
import { c } from 'ttag';

import { SquireType } from '../squireConfig';
import SquireToolbarDropdown from './SquireToolbarDropdown';
import Icon from '../../icon/Icon';
import DropdownMenu from '../../dropdown/DropdownMenu';
import DropdownMenuButton from '../../dropdown/DropdownMenuButton';

enum ALIGNMENT {
    Left = 'left',
    Center = 'center',
    Justify = 'justify',
    Right = 'right'
}

interface Props {
    squireRef: MutableRefObject<SquireType>;
    pathInfos: { [pathInfo: string]: boolean };
}

const SquireToolbarAlignmentDropdown = ({ squireRef, pathInfos }: Props) => {
    const handleClick = (alignment: ALIGNMENT) => () => {
        squireRef.current.setTextAlignment(alignment);
    };

    return (
        <SquireToolbarDropdown
            content={<Icon name="text-align-left" />}
            className="flex-item-noshrink"
            title={c('Action').t`Alignment`}
        >
            <DropdownMenu>
                <DropdownMenuButton
                    className="alignleft flex flex-nowrap"
                    aria-pressed={pathInfos.alignLeft}
                    onClick={handleClick(ALIGNMENT.Left)}
                >
                    <Icon name="text-align-left" className="mt0-25" />
                    <span className="ml0-5 mtauto mbauto flex-item-fluid">{c('Info').t`Align left`}</span>
                </DropdownMenuButton>
                <DropdownMenuButton
                    className="alignleft flex flex-nowrap"
                    aria-pressed={pathInfos.alignCenter}
                    onClick={handleClick(ALIGNMENT.Center)}
                >
                    <Icon name="text-center" className="mt0-25" />
                    <span className="ml0-5 mtauto mbauto flex-item-fluid">{c('Info').t`Center`}</span>
                </DropdownMenuButton>
                <DropdownMenuButton
                    className="alignleft flex flex-nowrap"
                    aria-pressed={pathInfos.alignRight}
                    onClick={handleClick(ALIGNMENT.Right)}
                >
                    <Icon name="text-align-right" className="mt0-25" />
                    <span className="ml0-5 mtauto mbauto flex-item-fluid">{c('Info').t`Align right`}</span>
                </DropdownMenuButton>
                <DropdownMenuButton
                    className="alignleft flex flex-nowrap"
                    aria-pressed={pathInfos.alignJustify}
                    onClick={handleClick(ALIGNMENT.Justify)}
                >
                    <Icon name="text-justify" className="mt0-25" />
                    <span className="ml0-5 mtauto mbauto flex-item-fluid">{c('Info').t`Justify`}</span>
                </DropdownMenuButton>
            </DropdownMenu>
        </SquireToolbarDropdown>
    );
};

export default SquireToolbarAlignmentDropdown;
