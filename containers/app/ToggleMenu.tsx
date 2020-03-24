import React from 'react';
import { classnames, Icon } from 'react-components';
import { c } from 'ttag';

interface Props {
    isCollapsedMenu: boolean;
    onToggleMenu: (isCollapsedMenu: boolean) => void;
}

const ToggleMenu = ({ isCollapsedMenu, onToggleMenu }: Props) => {
    const handleClick = () => onToggleMenu(!isCollapsedMenu);
    return (
        <button
            type="button"
            className={classnames(['collapse-button flex center', isCollapsedMenu && 'collapse-button--expandButton'])}
            title={isCollapsedMenu ? c('Action').t`Expand menu` : c('Action').t`Collapse menu`}
            onClick={handleClick}
        >
            <Icon name="caret-double-left" className="mauto fill-white" />
            <span className="sr-only">
                {isCollapsedMenu ? c('Action').t`Expand menu` : c('Action').t`Collapse menu`}
            </span>
        </button>
    );
};

export default ToggleMenu;
